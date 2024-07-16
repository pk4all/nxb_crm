import { Controller,Get, Post,Render } from '@nestjs/common';
import { WebService } from './web.service';

@Controller()
export class WebController {
    constructor(private readonly webService: WebService) {}


    @Get('/')
    @Render('index')
    getHello(){
        return {message:'Test'};
    }

    @Get('/login')
    @Render('user/login')
    async login(){
        return {layout:'user_login'}
    }

    @Get('/register')
    @Render('user/register')
    async register(){
        return {layout:'user_login'}
    }

    @Get('/forgot-password')
    @Render('user/forgot_password')
    async forgotPassword(){
        return {layout:'user_login'}
    }
}
