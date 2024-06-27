import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder,SwaggerDocumentOptions } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as expressHandlebars from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import * as hbs from 'hbs';
async function bootstrap() {
  // Register a JSON helper
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.engine(
    'hbs',
    expressHandlebars.engine({
      extname: 'hbs',
      defaultLayout: 'main', // Default layout file
      layoutsDir: join(__dirname, '..', 'views/layouts'),
      partialsDir: join(__dirname, '..', 'views/partials'),
      helpers: {
        incrementedIndex: function (index: number) {
          return index + 1;
        },
        json: function (context: any) {
          return JSON.stringify(context);
        },
        jsonParse: function (context: any) {
          var l = JSON.stringify(context);
          return JSON.parse(l);
        },
        gt: function (a: number, b: number) {
          return a > b;
        },
        lt: function (a: number, b: number) {
          return a < b;
        },
        eq: function (a: any, b: any) {
          ///console.log(a,b);
          return a == b;
        }
      }
    }),
  );
  // hbs.registerHelper('debug', function (context) {
  //   return JSON.stringify(context);
  // });
  // hbs.registerHelper('incrementedIndex', function (index) {
  //   return index + 1;
  // });
  app.setViewEngine('hbs');
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
  app.setViewEngine('hbs');
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.use(
    session({
      secret: 'f1d2d2f924e986ac86fdf7b36c94bcdf32beec15a0a48641b8edc446620aeb8f',
      resave: true,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl:'mongodb://localhost/adolaa', // Use MongoDB URI from environment variables
        collectionName: 'sessions',
      }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  
  await app.listen(3000);
}
bootstrap();
