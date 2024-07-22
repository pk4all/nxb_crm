import { Controller,Get, Post,Render,Param } from '@nestjs/common';
import { WebService } from './web.service';
import { FormService } from 'src/user/form/form.service';

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

    @Get('/content/:type/:id')
    @Render('frontend_form')
    async frontForm(@Param('id') id: string){
        try {
            const f = await this.webService.getForm(id);
            return {layout:'web',data:f}
        } catch (error) {
            return {layout:'web',data:[],error:error.message}
        }
        
    }
}
