import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seguridad
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: [
      process.env.APP_URL || 'http://localhost:3000',
      process.env.ADMIN_URL || 'http://localhost:3001',
    ],
    credentials: true,
  });

  // Prefijo global
  app.setGlobalPrefix('api/v1');

  // Validacion global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger (documentacion API)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Apphgio Tools API')
      .setDescription('API para la plataforma de gestion de herramientas')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Autenticacion')
      .addTag('users', 'Gestion de usuarios')
      .addTag('tools', 'Gestion de herramientas')
      .addTag('categories', 'Categorias y secciones')
      .addTag('logs', 'Logs y errores')
      .addTag('analytics', 'Analytics y reportes')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`API running on http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
