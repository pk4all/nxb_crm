var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// session.guard.ts
import { Injectable } from '@nestjs/common';
const excludeUrls = [
    { path: '/logout' },
    { path: '/home' }
];
let UserSessionGuard = class UserSessionGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        if (!request.session.user) {
            request.session.flash = {
                error: 'You are not authorized for this page, Please login first.',
            };
            response.redirect('/login');
        }
        return request.session.user ? true : false;
    }
};
UserSessionGuard = __decorate([
    Injectable()
], UserSessionGuard);
export { UserSessionGuard };
//# sourceMappingURL=user.session.guard.js.map