import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import * as admin from 'firebase-admin';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
const serviceAccount = require('../../../public/firebasekey.json');
import { Subscriber,SubscriberSchema } from 'src/schemas/subscriber.schema';
@Module({
  imports:[MongooseModule.forFeature([
    {name:Subscriber.name,schema:SubscriberSchema}
  ])],
  controllers: [SettingController],
  providers: [
    SettingService,
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      },
    },
    {
      provide: 'FIREBASE_APP',
      useFactory: () => {
        return firebase.initializeApp({
          apiKey: "AIzaSyDl8f6EYFDkCdwA4E5HYv8NvwLxCq1TZtQ",
          authDomain: "crafttatva-com.firebaseapp.com",
          projectId: "crafttatva-com",
          storageBucket: "crafttatva-com.appspot.com",
          messagingSenderId: "648181233135",
          appId: "1:648181233135:web:76703ef5038f5d373d721a",
          measurementId: "G-W584HC0342"
        });
      },
    }
  ],
  exports: ['FIREBASE_ADMIN', 'FIREBASE_APP'],
})
export class SettingModule {}
