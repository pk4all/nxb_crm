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
const moment = require('moment');
const express = require('express');
require('dotenv').config();
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config';
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
          //console.log(JSON.parse(l),'l');
          return JSON.parse(l);
        },
        gt: function (a: number, b: number) {
          return a > b;
        },
        lt: function (a: number, b: number) {
          return a < b;
        },
        eq: function (a: any, b: any) {
          return a == b;
        },
        permissionIn: function (id: any, permissions: any) {
          const p = permissions.filter(elm=>(elm.id).toString()==id.toString());
          if(p[0]){
            return true;
          }else{
            return false;
          }
        },
        ternary: function (condition, valueIfTrue, valueIfFalse) {
          return condition ? valueIfTrue : valueIfFalse;
        },

        formatDate:function(date){
          return moment(date).format('MMM DD, YYYY hh:mm:ss A');
        },
        selected: function (a: any, b: any) {
          return a==b?'selected':'';
        }


      }
    }),
  );
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
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl:process.env.MONGO_URI, // Use MongoDB URI from environment variables
        collectionName: 'sessions',
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors();
  app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  });
  if (process.env.NODE_ENV === 'development') {
    const compiler = webpack(webpackConfig);
    app.use(
      webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
      }),
    );
    app.use(webpackHotMiddleware(compiler));
  }
  await app.listen(process.env.PORT);
}
bootstrap();
