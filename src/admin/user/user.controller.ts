import { Body, Controller, Get, Post,Render,Res,Req,UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { UserService } from './user.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { Response, Request } from 'express';

@ApiExcludeController()
@Controller('admin')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('/login')
    @Render('admin/login')
    async login(@Req() req: Request, @Res() res: Response){
        return {layout:'login',session: req.session}
    }
    @Post('/admin-login')
    //@Redirect('/admin/login', 303)
    async adminLogin(@Req() req: Request, @Res() res: Response){
        try {
            let u:any = await this.userService.signIn(req?.body?.email,req?.body?.password);
            console.log(u);
            if(u?.status=='success'){
                req.session.user ={u};
                return res.redirect('/admin/dashboard');
            }else{
                req.session.flash = {
                    error: u?.message,
                };
                req.session.user ={};
                return res.redirect('/admin/login');
                
            }
        } catch (error) {
            req.session.flash = {
                error: error.message,
            };
            req.session.user ={};
            return res.redirect('/admin/login');

        }
    }

    @UseGuards(SessionGuard)
    @Get('/dashboard')
    getDashboard(@Req() req: Request, @Res() res: Response) {

        res.render('admin/dashboard', {layout:'admin'});
    }


    @UseGuards(SessionGuard)
    @Get('/logout')
    logout(@Req() req: Request, @Res() res: Response) {
        req.session.destroy((err) => {
            if (err) {
              return res.redirect('/admin/dashboard');
            }
            res.redirect('/admin/login');
        });
    }
}
