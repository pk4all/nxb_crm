var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import { HttpAdapterHost } from '@nestjs/core';
let UserModule = class UserModule {
};
UserModule = __decorate([
    Module({
        imports: [
            MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        ],
        providers: [UserService, HttpAdapterHost],
        controllers: [UserController]
    })
], UserModule);
export { UserModule };
//# sourceMappingURL=user.module.js.map