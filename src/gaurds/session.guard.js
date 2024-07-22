var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// session.guard.ts
import { Injectable } from '@nestjs/common';
const excludeUrls = [
    { path: '/admin/logout' },
    { path: '/admin/dashboard' }
];
let SessionGuard = class SessionGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        if (!request.session.user) {
            request.session.flash = {
                error: 'You are not authorized for this page, Please login first.',
            };
            response.redirect('/admin/login');
        }
        else {
            const userRolePermissions = request.session.user?.role?.permissions;
            //const notIn = excludeUrls.indexOf(currPath) == -1;
            // console.log(currPath,notIn,'index');
            //console.log(userRolePermissions.length,'userRolePermissions');
            if (userRolePermissions && userRolePermissions.length > 0) {
                const userRolePermissionsWithAllowedUrls = [...userRolePermissions, ...excludeUrls];
                const currPath = request.route.path;
                //console.log(userRolePermissionsWithAllowedUrls,currPath);
                const rp = userRolePermissionsWithAllowedUrls.find(elm => elm.path == currPath);
                // console.log(rp);
                if (!rp) {
                    request.session.flash = {
                        error: 'You are not authorized for this page.',
                    };
                    response.redirect('/admin/dashboard');
                }
            }
            return request.session.user ? true : false;
        }
    }
};
SessionGuard = __decorate([
    Injectable()
], SessionGuard);
export { SessionGuard };
//# sourceMappingURL=session.guard.js.map