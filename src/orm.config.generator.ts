import { config } from 'dotenv';
import { existsSync, unlink, writeFile } from 'fs';
import { template } from 'lodash';
import { join } from 'path';
import { promisify } from 'util';
import { createLogger, format, Logger, transports } from 'winston';

const logger: Logger = createLogger({
  level: 'info',
  format: format.simple(),
  transports: [new transports.Console()],
});
void (async (): Promise<void> => {
  const DATABASE_TYPE = 'postgres';
  const ORM_CONFIG_FILE = 'ormconfig.json';
  const ROOT_PATH: string = process.cwd();
  const pathToWriteOrmConfig = join(ROOT_PATH, ORM_CONFIG_FILE);
  const writeFileAsync = promisify(writeFile);
  const unlinkAsync = promisify(unlink);

  if (existsSync(join(ROOT_PATH, '.env'))) {
    config();
  }
  const env = process.env.APP_ENV;

  if (!env) {
    throw new Error('Environment configuration is broken: APP_ENV are not defined');
  }
  try {
    const configTemplate = `
    {
        "type": "<%= type %>",
        "host": "<%= host %>",
        "port": <%= port %>,
        "username": "<%= username %>",
        "password": "<%= password %>",
        "database": "<%= database %>",
        "entities": ["<%= entities %>"],
        "subscribers": ["<%= subscribers %>"],
        "migrationsTableName": "<%= migrationsTableName %>",
        "migrations": ["<%= migrations %>"],
        "cli": {
            "migrationsDir": "<%= migrationsFolder %>"
        },
        "logging": false,
        "synchronize": false,
        "dropSchema": false
    }`;
    logger.info(`Current env is: ${env}`);
    const srcFolder = env === 'local' ? './dist/src' : './src';
    const migrationFolder = env === 'local' ? './dist' : '/srv';
    logger.info(`Src folder is: ${srcFolder}, migrations folders is: ${migrationFolder}`);

    const typeOrmConfigObject = {
      type: DATABASE_TYPE,
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: `${srcFolder}/**/**.entity.js`,
      subscribers: `${srcFolder}/**/**.subscriber.js`,
      migrationsTableName: 'migrations',
      migrations: `${migrationFolder}/migrations/*.js`,
      migrationsFolder: 'migrations',
    };
    const compiledTemplate = template(configTemplate)(typeOrmConfigObject);
    if (existsSync(pathToWriteOrmConfig)) {
      logger.warn('Orm config file already exists - lets recreate it');
      await unlinkAsync(pathToWriteOrmConfig);
    }
    await writeFileAsync(pathToWriteOrmConfig, compiledTemplate);
    logger.info(`Orm config has been created in: ${pathToWriteOrmConfig}`);
  } catch (e) {
    logger.error(`Error occurs during orm config file creation: ${e.message}`);
    throw e;
  }
})();
