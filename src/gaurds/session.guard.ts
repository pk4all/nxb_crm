// session.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Response, Request } from 'express';
const excludeUrls = [
  {path:'/admin/logout'},
  {path:'/admin/dashboard'}
];
@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    if(!request.session.user){
      request.session.flash = {
        error: 'You are not authorized for this page, Please login first.',
      };
      response.redirect('/admin/login');
    }
    else{
      const userRolePermissions = request.session.user?.role?.permissions;
      //const notIn = excludeUrls.indexOf(currPath) == -1;
     // console.log(currPath,notIn,'index');
     //console.log(userRolePermissions.length,'userRolePermissions');
      if(userRolePermissions && userRolePermissions.length>0){
        const userRolePermissionsWithAllowedUrls = [...userRolePermissions,...excludeUrls];
        const currPath = request.route.path;
        //console.log(userRolePermissionsWithAllowedUrls,currPath);
        const rp = userRolePermissionsWithAllowedUrls.find(elm=>elm.path==currPath);
       // console.log(rp);
        if(!rp){
          request.session.flash = {
            error: 'You are not authorized for this page.',
          };
          response.redirect('/admin/dashboard');
        }
      }
     return request.session.user ? true : false;
    }
    
  }
}
