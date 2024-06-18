import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder,SwaggerDocumentOptions } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as expressHandlebars from 'express-handlebars';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.engine(
    'hbs',
    expressHandlebars.engine({
      extname: 'hbs',
      defaultLayout: 'main', // Default layout file
      layoutsDir: join(__dirname, '..', 'views/layouts'),
      partialsDir: join(__dirname, '..', 'views/partials'),
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Adolaa APIs')
    .setDescription('The Adolaa all APIs')
    .setVersion('1.0')
    .addTag('Adolaa')
    .addBearerAuth(
      { 
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT' 
      },
      'access-token',
    )
    .build();
    const options: SwaggerDocumentOptions =  {
      operationIdFactory: (
        controllerKey: string,
        methodKey: string
      ) => methodKey
    };
  const document = SwaggerModule.createDocument(app, config,options);
  SwaggerModule.setup('adolaa-api', app, document);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  await app.listen(3000);
}
bootstrap();
