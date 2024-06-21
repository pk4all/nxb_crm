// session.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Response, Request } from 'express';
@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    //console.log('request in session gaurd',request.session?.user);
    if(!request.session.user){
      request.session.flash = {
        error: 'You are not authorized for this page, Please login first.',
    };
      response.redirect('/admin/login');
    }
    return request.session.user ? true : false;
  }
}
