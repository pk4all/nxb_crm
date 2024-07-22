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
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
//import { validate } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
let AuthService = class AuthService {
    userModel;
    jwtService;
    tokenBlacklist = new Set();
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async create(jsonData) {
        const createUserDto = plainToInstance(CreateUserDto, jsonData);
        const createdCat = new this.userModel(createUserDto);
        return await createdCat.save();
        //return await this.userModel.create(createUserDto);
    }
    async findAll() {
        return this.userModel.find().exec();
    }
    async findOne(email) {
        return this.userModel.findOne({ email }).select('-password').select('-__v').exec();
    }
    async findLogin(email) {
        return this.userModel.findOne({ email });
    }
    async signIn(username, pass) {
        const user = await this.findLogin(username);
        const isMatch = await bcrypt.compare(pass, user?.password);
        if (!isMatch) {
            throw new BadRequestException('User name or password is not valid', { cause: new Error(), description: 'Invalid Credentials' });
        }
        const payload = { id: user?.id, email: user?.email, name: user?.name };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    async validateUser(username, pass) {
        const user = await this.findOne(username);
        const isMatch = await bcrypt.compare(pass, user?.password);
        if (!isMatch) {
            throw new BadRequestException('User name or password is not valid', { cause: new Error(), description: 'Invalid Credentials' });
        }
        const { password, ...result } = user;
        return result;
        // const payload = { email: user.email, sub: user.name };
        // return {
        //   access_token: await this.jwtService.signAsync(payload),
        // };
    }
    blacklistToken(token) {
        this.tokenBlacklist.add(token);
    }
    isTokenBlacklisted(token) {
        return this.tokenBlacklist.has(token);
    }
};
AuthService = __decorate([
    Injectable(),
    __param(0, InjectModel(User.name)),
    __metadata("design:paramtypes", [Model,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map