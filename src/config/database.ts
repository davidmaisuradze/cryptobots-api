import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { AppEnvs } from "./enums/app.envs";

export const databaseConfiguration = (migrationsRun = true): TypeOrmModuleOptions => {
  const srcFolder = process.env.APP_ENV === AppEnvs.LOCAL ? './dist/src' : './src';
  let migrationFolder;
  let entitiesFolder;
  let subscribersFolder;

  switch (process.env.APP_ENV) {
    case AppEnvs.LOCAL: {
      migrationFolder = './dist/migrations/*.js';
      entitiesFolder = `${srcFolder}/**/**.entity.js`;
      subscribersFolder = `${srcFolder}/**/**.subscriber.js`;
      break;
    }
    case AppEnvs.INTEGRATION_TESTING: {
      migrationFolder = './migrations/*.ts';
      entitiesFolder = `${srcFolder}/**/**.entity.ts`;
      subscribersFolder = `${srcFolder}/**/**.subscriber.ts`;
      break;
    }
    default: {
      migrationFolder = '/srv/migrations/*.js';
      entitiesFolder = `${srcFolder}/**/**.entity.js`;
      subscribersFolder = `${srcFolder}/**/**.subscriber.js`;
      break;
    }
  }

  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    logging: process.env? ['migration', 'error', 'log', 'query'] : ['migration', 'error'],
    dropSchema: false,
    entities: [entitiesFolder],
    subscribers: [subscribersFolder],
    migrationsTableName: 'migrations',
    migrations: [migrationFolder],
    migrationsRun,
    cli: {
      migrationsDir: 'migrations',
    },
    ssl:
      process.env.ENABLE_SSL_DB === 'true'
        ? {
            cert: JSON.parse(process.env.PG_SSL_CERT),
            key: JSON.parse(process.env.PG_SSL_KEY),
            ca: JSON.parse(process.env.PG_SSL_ROOT_CERT),
          }
        : false,
  };
}