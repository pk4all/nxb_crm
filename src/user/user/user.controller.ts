import { Controller,Post, Body,Get,Render,Res,Req,UseFilters,UseGuards} from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../schemas/user.schema';
import { UserService } from './user.service';
import { createResponse } from '../../common/utils/response.util';
import { UserSessionGuard } from 'src/gaurds/user.session.guard';
import { Response, Request,Router } from 'express';
@Controller('user')
//@UseFilters(MongoExceptionFilter)
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post('/register')
    async registerUser(@Res() res: Response,@Req() req: Request,){
        try {
            const data = req?.body;
            const u = await this.userService.create(data);
            req.session.flash = {
                success:'User successfully created',
            };
            return res.redirect('/register');
        } catch (error) {
            console.log(error,'error');
            req.session.flash = {
                error: error.message,
            };
            return res.redirect('/register');
        }
    }

    @Post('/login')
    async login(@Req() req: Request, @Res() res: Response){
        try {
            let u:any = await this.userService.signIn(req?.body?.email,req?.body?.password);
            if(u?.status == 'success'){
                req.session.user = u?.user;
                return res.redirect('/user/dashboard');
            }else{
                req.session.flash = {
                    error: u?.message,
                };
                return res.redirect('/login');    
            }
        } catch (error) {
            req.session.flash = {
                error: error.message,
            };
            req.session.user ={};
            return res.redirect('/login');

        }
    }

    @UseGuards(UserSessionGuard)
    @Get('/logout')
    logout(@Req() req: Request, @Res() res: Response) {
        req.session.destroy((err) => {
            if (err) {
              return res.redirect('/dashboard');
            }
            res.redirect('/login');
        });
    }

    @UseGuards(UserSessionGuard)
    @Get('/dashboard')
    @Render('user/dashboard')
    async dashboard(){
        return {layout:'user'}
    }

}
