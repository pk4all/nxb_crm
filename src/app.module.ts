import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AdminUserModule } from './admin/user/user.module';
import { FlashMiddleware } from './common/flash.middleware';
import { CategoryModule } from './admin/category/category.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/adolaa'),
    AuthModule,
    UserModule,
    AdminUserModule,
    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FlashMiddleware).forRoutes('*');
  }
}
