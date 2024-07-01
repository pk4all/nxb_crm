import { Body, Controller, Get, Post,Render,Res,Req,UseGuards,Query } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { UserService } from './user.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { Response, Request,Router } from 'express';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';

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
    @Get('/logout')
    logout(@Req() req: Request, @Res() res: Response) {
        req.session.destroy((err) => {
            if (err) {
              return res.redirect('/admin/dashboard');
            }
            res.redirect('/admin/login');
        });
    }

    @UseGuards(SessionGuard)
    @Get('/dashboard')
    getDashboard(@Req() req: Request, @Res() res: Response) {
        res.render('admin/dashboard', {layout:'admin'});
    }

    @UseGuards(SessionGuard)
    @Get('/user/permissions')
    @Render('admin/user/permissions')
    async getAllPermission(@Query() paginationQuery: PaginationQueryDto, @Query('sortBy') sortBy: string = 'createdAt',@Query('sortOrder') sortOrder: string = 'desc',@Req() req: Request,@Res() res: Response): Promise<{ permissions:any, pagination:any,layout:string}> {
        try {
            const {page=1,limit=5} = paginationQuery;
            const permissions=await this.userService.getAllPermissions(paginationQuery,sortBy,sortOrder);;
            const pagination = await this.userService.getPaginatedPermission(limit, page);
            return {layout:'admin',pagination,permissions};
        } catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
        
    }

    @UseGuards(SessionGuard)
    @Get('/user/sync-permissions')
    async syncPermissions(@Req() req: Request,@Res() res: Response) {
        const router = req.app._router as Router;
        const allRoutes = {
            routes: router.stack
                .map(layer => {
                    if(layer.route) {
                        const path = layer.route?.path;
                        const method = layer.route?.stack[0].method;
                        const name = path.replace(/\/?admin\//, '').replace(/\/:\w+/g, '');
                        return {method:method,path:path,name:name};
                        //return `${method.toUpperCase()} ${path}`
                    }
                })
                .filter(item => item !== undefined && item.path.includes('admin/'))   
        };
        try {
            //console.log(allRoutes);
            await this.userService.saveAllRoutes(allRoutes?.routes);
            res.json({status:'success'});
        } catch (error) {
            res.json({status:'error'});
        }
        
    }

}
