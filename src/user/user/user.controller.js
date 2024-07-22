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
import { Controller, Post, Get, Render, Res, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserSessionGuard } from "../../gaurds/user.session.guard";
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async registerUser(res, req) {
        try {
            const data = req?.body;
            const u = await this.userService.create(data);
            req.session.flash = {
                success: 'User successfully created',
            };
            return res.redirect('/register');
        }
        catch (error) {
            console.log(error, 'error');
            req.session.flash = {
                error: error.message,
            };
            return res.redirect('/register');
        }
    }
    async login(req, res) {
        try {
            let u = await this.userService.signIn(req?.body?.email, req?.body?.password);
            if (u?.status == 'success') {
                req.session.user = u?.user;
                return res.redirect('/user/dashboard');
            }
            else {
                req.session.flash = {
                    error: u?.message,
                };
                return res.redirect('/login');
            }
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
            req.session.user = {};
            return res.redirect('/login');
        }
    }
    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.redirect('/dashboard');
            }
            res.redirect('/login');
        });
    }
    async dashboard() {
        return { layout: 'user' };
    }
};
__decorate([
    Post('/register'),
    __param(0, Res()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "registerUser", null);
__decorate([
    Post('/login'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    UseGuards(UserSessionGuard),
    Get('/logout'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "logout", null);
__decorate([
    UseGuards(UserSessionGuard),
    Get('/dashboard'),
    Render('user/dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "dashboard", null);
UserController = __decorate([
    Controller('user')
    //@UseFilters(MongoExceptionFilter)
    ,
    __metadata("design:paramtypes", [UserService])
], UserController);
export { UserController };
//# sourceMappingURL=user.controller.js.map