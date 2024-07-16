import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user/user.module';
import { AdminUserModule } from './admin/user/user.module';
import { FlashMiddleware } from './common/flash.middleware';
import { CategoryModule } from './admin/category/category.module';
import { PageModule } from './admin/page/page.module';
import { FaqModule } from './admin/faq/faq.module';
import { SettingModule } from './admin/setting/setting.module';
import { AdsModule } from './admin/ads/ads.module';
import { SubscriptionModule } from './admin/subscription/subscription.module';
import { WebModule } from './web/web.module';
require('dotenv').config();
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    UserModule,
    AdminUserModule,
    CategoryModule,
    PageModule,
    FaqModule,
    SettingModule,
    AdsModule,
    SubscriptionModule,
    WebModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FlashMiddleware).forRoutes('*');
  }
}
