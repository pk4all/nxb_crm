var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
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
import { FormModule } from './user/form/form.module';
require('dotenv').config();
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(FlashMiddleware).forRoutes('*');
    }
};
AppModule = __decorate([
    Module({
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
            WebModule,
            FormModule
        ],
        controllers: [AppController],
        providers: [AppService],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map