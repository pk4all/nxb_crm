import { Body, Controller, Get, Post,Render,Res,Req,UseGuards,Query,Param } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { UserService } from './user.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { Response, Request,Router } from 'express';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { permission } from 'process';
import { bool } from 'sharp';

@ApiExcludeController()
@Controller('admin')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('/login')
    @Render('admin/login')
    async login(@Req() req: Request, @Res() res: Response){
        if(req.session.user){
            res.redirect('/admin/dashboard');
        }
        return {layout:'login',session: req.session}
    }
    @Post('/admin-login')
    //@Redirect('/admin/login', 303)
    async adminLogin(@Req() req: Request, @Res() res: Response){
        try {
            let u:any = await this.userService.signIn(req?.body?.email,req?.body?.password);
            if(u?.status == 'success'){
                req.session.user = u?.user;
                return res.redirect('/admin/dashboard');
            }else{
                req.session.flash = {
                    error: u?.message,
                };
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
        //console.log(req.session.user);
        res.render('admin/dashboard', {layout:'admin'});
    }

    @UseGuards(SessionGuard)
    @Get('/user/permissions')
    @Render('admin/user/permissions')
    async getAllPermission(@Query() paginationQuery: PaginationQueryDto, @Query('sortBy') sortBy: string = 'name',@Query('sortOrder') sortOrder: string = 'asc',@Req() req: Request,@Res() res: Response): Promise<{ permissions:any, pagination:any,layout:string}> {
        try {
            const {page=1,limit=20} = paginationQuery;
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

    @UseGuards(SessionGuard)
    @Post('/user/change-permission-name')
    async changePermissionName(@Req() req: Request,@Res() res: Response){
        const data = req.body;
        try {
            await this.userService.updatePermission({name:data?.value},data?.pk);
            res.json({status:'success'});
        } catch (error) {
            res.json({status:'error',message:error?.message});
        }
    }

    @Post('/user/permission/change-status/:id')
    async updateStatus(@Param('id') id: string,@Req() req: Request, @Res() res: Response){
        try {
            const permissionData = await this.userService.getPermission(id);
            //console.log(permissionData);
            if(permissionData?.status){
                permissionData.status = false;
            }else{
                permissionData.status = true;
            }
            await this.userService.updatePermission({status:permissionData.status},id);
            res.json({status:'success',message: 'Permission status changed successfully.'});
        }catch (error){
            res.json({status:'error',message: error.message});
        }
    }

    @UseGuards(SessionGuard)
    @Get('/user/role/add')
    async addRole(@Req() req: Request, @Res() res: Response) {
        try {
            const allPermissions = await this.userService.getAllUserPermissions();
            res.render('admin/user/add_role', {layout:'admin',allPermissions});
        } catch (error) {
            req.session.flash = {
                error: error.message,
            };
        } 
    }

    @UseGuards(SessionGuard)
    @Get('/user/role/edit/:id')
    async editRole(@Param('id') id: string,@Req() req: Request, @Res() res: Response) {
        try {
            const allPermissions = await this.userService.getAllUserPermissions();
            const roleData = await this.userService.getRole(id);
            res.render('admin/user/edit_role', {layout:'admin',allPermissions,roleData});
        } catch (error) {
            req.session.flash = {
                error: error.message,
            };
        } 
    }

    @Post('/user-role/save')
    async saveUserRole(@Req() req: Request, @Res() res: Response){
        try {
            const data = req?.body;
            const allSelectedPermissionsIds = data?.permissions;
            const  allSelectedPermissions = await this.userService.getAllSelectedPermissions(allSelectedPermissionsIds);
            const selectedPermissions = allSelectedPermissions.map(elm=>{
                return {id:elm?._id,name:elm?.name,path:elm?.path,method:elm?.method};
            });
            if(data.status=='on'){
                data.status=true;
            }else{
                data.status=false;
            }
            const roleData = {name:data?.name,permissions:selectedPermissions,status:data?.status};
            await this.userService.saveRole(roleData);
            req.session.flash = {
                success:'Role successfully created',
            };
            return res.redirect('/admin/user/roles');
        }catch (error){
            req.session.flash = {
                error:error?.message,
            };
            return res.redirect('/admin/user/roles');
            //res.json({status:'error',message: error.message});
        }
    }

    @Post('/user-role/update/:id')
    async updateUserRole(@Param('id') id: string,@Req() req: Request, @Res() res: Response){
        try {
            const data = req?.body;
            const allSelectedPermissionsIds = data?.permissions;
            const  allSelectedPermissions = await this.userService.getAllSelectedPermissions(allSelectedPermissionsIds);
            const selectedPermissions = allSelectedPermissions.map(elm=>{
                return {id:elm?._id,name:elm?.name,path:elm?.path,method:elm?.method};
            });
            if(data.status=='on'){
                data.status=true;
            }else{
                data.status=false;
            }
            const roleData = {name:data?.name,permissions:selectedPermissions,status:data?.status};
            await this.userService.updateRole(roleData,id);
            req.session.flash = {
                success:'Role successfully Updated',
            };
            return res.redirect('/admin/user/roles');
        }catch (error){
            req.session.flash = {
                error:error?.message,
            };
            return res.redirect('/admin/user/roles');
            //res.json({status:'error',message: error.message});
        }
    }

    @UseGuards(SessionGuard)
    @Get('/user/roles')
    @Render('admin/user/roles')
    async userRoles(@Query() paginationQuery: PaginationQueryDto, @Query('sortBy') sortBy: string = 'createdAt',@Query('sortOrder') sortOrder: string = 'desc',@Req() req: Request,@Res() res: Response): Promise<{ roles:any, pagination:any,layout:string}> {
        try {
            const {page=1,limit=5} = paginationQuery;
            const roles=await this.userService.getAllRoles(paginationQuery,sortBy,sortOrder);;
            const pagination = await this.userService.getPaginatedRoles(limit, page);
            return {layout:'admin',pagination,roles};
        } catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
    }

    @UseGuards(SessionGuard)
    @Post('/user/role/change-status/:id')
    async updateRoleStatus(@Param('id') id: string,@Req() req: Request, @Res() res: Response){
        try {
            const roleData = await this.userService.getRole(id);
            if(roleData?.status){
                roleData.status = false;
            }else{
                roleData.status = true;
            }
            await this.userService.updateRole({status:roleData.status},id);
            res.json({status:'success',message: 'Role status changed successfully.'});
        }catch (error){
            res.json({status:'error',message: error.message});
        }
    }

    @UseGuards(SessionGuard)
    @Get('/users')
    @Render('admin/user/users')
    async users(@Query() paginationQuery: PaginationQueryDto, @Query('sortBy') sortBy: string = 'createdAt',@Query('sortOrder') sortOrder: string = 'desc',@Req() req: Request,@Res() res: Response): Promise<{ users:any, pagination:any,layout:string}> {
        try {
            const {page=1,limit=5} = paginationQuery;
            const users=await this.userService.getAllUsers(paginationQuery,sortBy,sortOrder);;
            const pagination = await this.userService.getPaginatedUsers(limit, page);
            return {layout:'admin',pagination,users};
        } catch (error) {
            req.session.flash = {
                error: error.message,
            };
        } 
    }

    @UseGuards(SessionGuard)
    @Get('/user/add')
    async addUser(@Req() req: Request, @Res() res: Response) {
        try {
            const allRoles = await this.userService.getRoles();
            res.render('admin/user/add', {layout:'admin',allRoles});
        } catch (error) {
            req.session.flash = {
                error: error.message,
            };
        } 
    }
    @UseGuards(SessionGuard)
    @Post('/user/save')
    async saveUser(@Req() req: Request, @Res() res: Response) {
        try {
            const data = req?.body;
            const role = await this.userService.getRole(data?.role);
            data.roleName=role?.name;
            if(data.status=='on'){
                data.status=true;
            }else{
                data.status=false;
            }
            await this.userService.createUser(data);
            req.session.flash = {
                success:'User successfully created',
            };
            return res.redirect('/admin/users');
        } catch (error) {
            req.session.flash = {
                error: error.message,
            };
        } 
    }
    @UseGuards(SessionGuard)
    @Get('/user/edit/:id')
    async editUser(@Param('id') id: string,@Req() req: Request, @Res() res: Response) {
        try {
            const allRoles = await this.userService.getRoles();
            const user = await this.userService.getUser(id);
            res.render('admin/user/edit', {layout:'admin',allRoles,user});
        } catch (error) {
            req.session.flash = {
                error: error.message,
            };
        } 
    }

    @UseGuards(SessionGuard)
    @Post('/user/update/:id')
    async updateUser(@Param('id') id: string,@Req() req: Request, @Res() res: Response){
        const data = req?.body;
        try {
            const role = await this.userService.getRole(data?.role);
            data.roleName=role?.name;
            if(data.status=='on'){
                data.status=true;
            }else{
                data.status=false;
            }
            if(data.password==''){
                delete data['password'];
            }
            await this.userService.updateUser(data,id);
            req.session.flash = {
                success:'User successfully Updated',
            };
            return res.redirect('/admin/users');
        } catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
    }

    @UseGuards(SessionGuard)
    @Post('/user/change-status/:id')
    async updateUserStatus(@Param('id') id: string,@Req() req: Request, @Res() res: Response){
        try {
            const roleData = await this.userService.getUser(id);
            if(roleData?.status){
                roleData.status = false;
            }else{
                roleData.status = true;
            }
            await this.userService.updateUser({status:roleData.status},id);
            res.json({status:'success',message: 'User status changed successfully.'});
        }catch (error){
            res.json({status:'error',message: error.message});
        }
    }

    @UseGuards(SessionGuard)
    @Get('/user/profile')
    @Render('admin/user/profile')
    async profile(@Req() req: Request, @Res() res: Response){
        return {layout:'admin'}
    }

}
