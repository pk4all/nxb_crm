var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import * as bcrypt from 'bcrypt';
let UserService = class UserService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(jsonData) {
        try {
            return await this.userModel.create(jsonData);
        }
        catch (error) {
            throw new BadRequestException(error?.message || 'Data not saved');
        }
    }
    async findLogin(email) {
        return this.userModel.findOne({ email }).lean();
    }
    async signIn(username, pass) {
        try {
            const user = await this.findLogin(username);
            const isMatch = await bcrypt.compare(pass, user?.password);
            if (!isMatch) {
                //return {message:'Password is not valid',status:'error'};
                throw new BadRequestException('User name or password is not valid', { cause: new Error(), description: 'Invalid Credentials' });
            }
            return { user: user, status: 'success' };
        }
        catch (error) {
            //return {message:'User name or password is not valid',status:'error'};
            throw new BadRequestException(error.message, { cause: new Error(), description: 'Invalid Credentials, please retry.' });
        }
    }
};
UserService = __decorate([
    Injectable(),
    __param(0, InjectModel(User.name)),
    __metadata("design:paramtypes", [Model])
], UserService);
export { UserService };
//# sourceMappingURL=user.service.js.map