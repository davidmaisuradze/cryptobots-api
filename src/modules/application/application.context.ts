import { ValidationPipe, INestApplication, ValidationError } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import pjson from 'pjson';
import { AppModule } from './app.module';
import { ValidationErrorException } from '../../exceptions/validation-error.exception';
import { SeederService } from '../seeder/seeder.service';

let context: INestApplication = null;
export const ApplicationContext = async (): Promise<INestApplication> => {
  if (!context) {
    context = await NestFactory.create(AppModule, {

    });
    context.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        exceptionFactory: (errors: ValidationError[]) => new ValidationErrorException(errors),
      }),
    );
    useContainer(context.select(AppModule), { fallbackOnErrors: true });
    const configService = context.get(ConfigService);
    const seederService = context.get(SeederService);
    const basePath = `${configService.get('APP_BASE_PREFIX_PATH')}/${configService.get('APP_BASE_API_PATH')}`;
    context.enableCors({
      credentials: true,
      origin: configService.get('CORS_ORIGINS').split(','),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
    context.setGlobalPrefix(basePath);
    context.use(helmet());
    context.use(helmet.referrerPolicy({ policy: 'no-referrer' }));

    context.enableShutdownHooks();
    if (configService.get('ENABLE_SWAGGER_DOCS') === 'true') {
      const swaggerOptions = new DocumentBuilder()
        .setTitle('Edge API')
        .setDescription('This page provides Edge API v1 documentation')
        .setVersion(pjson.version)
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'Authorization',
            description: 'Authorization that used for external applications',
          },
          'jwt',
        )
        .addBearerAuth(
          {
            type: 'apiKey',
            in: 'header',
            name: 'airlock-authorization',
            description: 'Authorization that used for edge frontend users',
          },
          'airlock',
        )
        .addBasicAuth(
          {
            type: 'http',
            name: 'basic-authorization',
            description: 'Authorization that used for hummingbird',
          },
          'basic',
        )
        .build();
      const swaggerDocument = SwaggerModule.createDocument(context, swaggerOptions);
      SwaggerModule.setup(`${basePath}/docs`, context, swaggerDocument);
    }

    if(configService.get('SEED_DATABASE') === 'true') {
      await seederService.seedDatabase();
    }
  }
  return context;
};
