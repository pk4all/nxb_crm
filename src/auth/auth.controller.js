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
import { Body, Controller, Get, Post, UseGuards, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth.guard';
import { createResponse } from '../common/utils/response.util';
//import { JwtAuthGuard } from './jwt-auth.guard';
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    //@UseGuards(AuthGuard('local'))
    //@UseGuards(LocalAuthGuard)
    async login(createUserDto) {
        try {
            const u = await this.authService.signIn(createUserDto?.email, createUserDto?.password);
            return createResponse(200, u, 'Login successfully ', 'success');
        }
        catch (error) {
            return createResponse(error.statusCode, '', error.message, 'error');
        }
    }
    async logut(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (token) {
                this.authService.blacklistToken(token);
            }
            res.clearCookie('access_token'); // If you are using cookies for token storage
            res.send({ statusCode: 200, status: 'sucess', message: 'Logged out successfully' });
        }
        catch (error) {
            res.send({ statusCode: 200, status: 'error', message: error?.message });
        }
    }
    async getProfile(req) {
        //return req?.user['email'];
        try {
            const u = await this.authService.findOne(req?.user['email']);
            return createResponse(200, u, 'User Profile Date ', 'success');
        }
        catch (error) {
            return createResponse(error.statusCode, '', error.message, 'error');
        }
    }
};
__decorate([
    Post('/auth/login'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    Post('/auth/logout'),
    ApiBearerAuth('access-token'),
    UseGuards(JwtAuthGuard),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logut", null);
__decorate([
    Get('/user/profile'),
    ApiBearerAuth('access-token'),
    UseGuards(JwtAuthGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
AuthController = __decorate([
    Controller('api/'),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map