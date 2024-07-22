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
import { Controller, Get, Render, Param } from '@nestjs/common';
import { WebService } from './web.service';
let WebController = class WebController {
    webService;
    constructor(webService) {
        this.webService = webService;
    }
    getHello() {
        return { message: 'Test' };
    }
    async login() {
        return { layout: 'user_login' };
    }
    async register() {
        return { layout: 'user_login' };
    }
    async forgotPassword() {
        return { layout: 'user_login' };
    }
    async frontForm(id) {
        try {
            const f = await this.webService.getForm(id);
            return { layout: 'web', data: f };
        }
        catch (error) {
            return { layout: 'web', data: [], error: error.message };
        }
    }
};
__decorate([
    Get('/'),
    Render('index'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebController.prototype, "getHello", null);
__decorate([
    Get('/login'),
    Render('user/login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebController.prototype, "login", null);
__decorate([
    Get('/register'),
    Render('user/register'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebController.prototype, "register", null);
__decorate([
    Get('/forgot-password'),
    Render('user/forgot_password'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebController.prototype, "forgotPassword", null);
__decorate([
    Get('/content/:type/:id'),
    Render('frontend_form'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "frontForm", null);
WebController = __decorate([
    Controller(),
    __metadata("design:paramtypes", [WebService])
], WebController);
export { WebController };
//# sourceMappingURL=web.controller.js.map