import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder,SwaggerDocumentOptions } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Adolaa APIs')
    .setDescription('The Adolaa all APIs')
    .setVersion('1.0')
    .addTag('Adolaa')
    .build();
    const options: SwaggerDocumentOptions =  {
      operationIdFactory: (
        controllerKey: string,
        methodKey: string
      ) => methodKey
    };
  const document = SwaggerModule.createDocument(app, config,options);
  SwaggerModule.setup('adolaa-api', app, document);
  await app.listen(3000);
}
bootstrap();
