// session.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Response, Request } from 'express';
const excludeUrls = [
  {path:'/logout'},
  {path:'/home'}
];
@Injectable()
export class UserSessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    if(!request.session.user){
      request.session.flash = {
        error: 'You are not authorized for this page, Please login first.',
      };
      response.redirect('/login');
    }
    return request.session.user ? true : false;
  }
}
