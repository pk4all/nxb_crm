var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Render, Res, Req, UseGuards, Query, Param } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { UserService } from './user.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { PaginationQueryDto } from "../../dto/pagination-query.dto";
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async login(req, res) {
        if (req.session.user) {
            res.redirect('/admin/dashboard');
        }
        return { layout: 'login', session: req.session };
    }
    //@Redirect('/admin/login', 303)
    async adminLogin(req, res) {
        try {
            let u = await this.userService.signIn(req?.body?.email, req?.body?.password);
            if (u?.status == 'success') {
                req.session.user = u?.user;
                return res.redirect('/admin/dashboard');
            }
            else {
                req.session.flash = {
                    error: u?.message,
                };
                return res.redirect('/admin/login');
            }
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
            req.session.user = {};
            return res.redirect('/admin/login');
        }
    }
    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.redirect('/admin/dashboard');
            }
            res.redirect('/admin/login');
        });
    }
    getDashboard(req, res) {
        //console.log(req.session.user);
        res.render('admin/dashboard', { layout: 'admin' });
    }
    async getAllPermission(paginationQuery, sortBy = 'name', sortOrder = 'asc', req, res) {
        try {
            const { page = 1, limit = 20 } = paginationQuery;
            const permissions = await this.userService.getAllPermissions(paginationQuery, sortBy, sortOrder);
            ;
            const pagination = await this.userService.getPaginatedPermission(limit, page);
            return { layout: 'admin', pagination, permissions };
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
    }
    async syncPermissions(req, res) {
        const router = req.app._router;
        const allRoutes = {
            routes: router.stack
                .map(layer => {
                if (layer.route) {
                    const path = layer.route?.path;
                    const method = layer.route?.stack[0].method;
                    const name = path.replace(/\/?admin\//, '').replace(/\/:\w+/g, '');
                    return { method: method, path: path, name: name };
                    //return `${method.toUpperCase()} ${path}`
                }
            })
                .filter(item => item !== undefined && item.path.includes('admin/'))
        };
        try {
            //console.log(allRoutes);
            await this.userService.saveAllRoutes(allRoutes?.routes);
            res.json({ status: 'success' });
        }
        catch (error) {
            res.json({ status: 'error' });
        }
    }
    async changePermissionName(req, res) {
        const data = req.body;
        try {
            await this.userService.updatePermission({ name: data?.value }, data?.pk);
            res.json({ status: 'success' });
        }
        catch (error) {
            res.json({ status: 'error', message: error?.message });
        }
    }
    async updateStatus(id, req, res) {
        try {
            const permissionData = await this.userService.getPermission(id);
            //console.log(permissionData);
            if (permissionData?.status) {
                permissionData.status = false;
            }
            else {
                permissionData.status = true;
            }
            await this.userService.updatePermission({ status: permissionData.status }, id);
            res.json({ status: 'success', message: 'Permission status changed successfully.' });
        }
        catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
    async addRole(req, res) {
        try {
            const allPermissions = await this.userService.getAllUserPermissions();
            res.render('admin/user/add_role', { layout: 'admin', allPermissions });
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
    }
    async editRole(id, req, res) {
        try {
            const allPermissions = await this.userService.getAllUserPermissions();
            const roleData = await this.userService.getRole(id);
            res.render('admin/user/edit_role', { layout: 'admin', allPermissions, roleData });
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
    }
    async saveUserRole(req, res) {
        try {
            const data = req?.body;
            const allSelectedPermissionsIds = data?.permissions;
            const allSelectedPermissions = await this.userService.getAllSelectedPermissions(allSelectedPermissionsIds);
            const selectedPermissions = allSelectedPermissions.map(elm => {
                return { id: elm?._id, name: elm?.name, path: elm?.path, method: elm?.method };
            });
            if (data.status == 'on') {
                data.status = true;
            }
            else {
                data.status = false;
            }
            const roleData = { name: data?.name, permissions: selectedPermissions, status: data?.status };
            await this.userService.saveRole(roleData);
            req.session.flash = {
                success: 'Role successfully created',
            };
            return res.redirect('/admin/user/roles');
        }
        catch (error) {
            req.session.flash = {
                error: error?.message,
            };
            return res.redirect('/admin/user/roles');
            //res.json({status:'error',message: error.message});
        }
    }
    async updateUserRole(id, req, res) {
        try {
            const data = req?.body;
            const allSelectedPermissionsIds = data?.permissions;
            const allSelectedPermissions = await this.userService.getAllSelectedPermissions(allSelectedPermissionsIds);
            const selectedPermissions = allSelectedPermissions.map(elm => {
                return { id: elm?._id, name: elm?.name, path: elm?.path, method: elm?.method };
            });
            if (data.status == 'on') {
                data.status = true;
            }
            else {
                data.status = false;
            }
            const roleData = { name: data?.name, permissions: selectedPermissions, status: data?.status };
            await this.userService.updateRole(roleData, id);
            req.session.flash = {
                success: 'Role successfully Updated',
            };
            return res.redirect('/admin/user/roles');
        }
        catch (error) {
            req.session.flash = {
                error: error?.message,
            };
            return res.redirect('/admin/user/roles');
            //res.json({status:'error',message: error.message});
        }
    }
    async userRoles(paginationQuery, sortBy = 'createdAt', sortOrder = 'desc', req, res) {
        try {
            const { page = 1, limit = 5 } = paginationQuery;
            const roles = await this.userService.getAllRoles(paginationQuery, sortBy, sortOrder);
            ;
            const pagination = await this.userService.getPaginatedRoles(limit, page);
            return { layout: 'admin', pagination, roles };
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
    }
    async updateRoleStatus(id, req, res) {
        try {
            const roleData = await this.userService.getRole(id);
            if (roleData?.status) {
                roleData.status = false;
            }
            else {
                roleData.status = true;
            }
            await this.userService.updateRole({ status: roleData.status }, id);
            res.json({ status: 'success', message: 'Role status changed successfully.' });
        }
        catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
    async users(paginationQuery, sortBy = 'createdAt', sortOrder = 'desc', req, res) {
        try {
            const { page = 1, limit = 5 } = paginationQuery;
            const users = await this.userService.getAllUsers(paginationQuery, sortBy, sortOrder);
            ;
            const pagination = await this.userService.getPaginatedUsers(limit, page);
            return { layout: 'admin', pagination, users };
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
    }
    async addUser(req, res) {
        try {
            const allRoles = await this.userService.getRoles();
            res.render('admin/user/add', { layout: 'admin', allRoles });
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
    }
    async saveUser(req, res) {
        try {
            const data = req?.body;
            const role = await this.userService.getRole(data?.role);
            data.roleName = role?.name;
            if (data.status == 'on') {
                data.status = true;
            }
            else {
                data.status = false;
            }
            await this.userService.createUser(data);
            req.session.flash = {
                success: 'User successfully created',
            };
            return res.redirect('/admin/users');
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
    }
    async editUser(id, req, res) {
        try {
            const allRoles = await this.userService.getRoles();
            const user = await this.userService.getUser(id);
            res.render('admin/user/edit', { layout: 'admin', allRoles, user });
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
    }
    async updateUser(id, req, res) {
        const data = req?.body;
        try {
            const role = await this.userService.getRole(data?.role);
            data.roleName = role?.name;
            if (data.status == 'on') {
                data.status = true;
            }
            else {
                data.status = false;
            }
            if (data.password == '') {
                delete data['password'];
            }
            await this.userService.updateUser(data, id);
            req.session.flash = {
                success: 'User successfully Updated',
            };
            return res.redirect('/admin/users');
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
    }
    async updateUserStatus(id, req, res) {
        try {
            const roleData = await this.userService.getUser(id);
            if (roleData?.status) {
                roleData.status = false;
            }
            else {
                roleData.status = true;
            }
            await this.userService.updateUser({ status: roleData.status }, id);
            res.json({ status: 'success', message: 'User status changed successfully.' });
        }
        catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
    async profile(req, res) {
        return { layout: 'admin' };
    }
};
__decorate([
    Get('/login'),
    Render('admin/login'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    Post('/admin-login')
    //@Redirect('/admin/login', 303)
    ,
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminLogin", null);
__decorate([
    UseGuards(SessionGuard),
    Get('/logout'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "logout", null);
__decorate([
    UseGuards(SessionGuard),
    Get('/dashboard'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getDashboard", null);
__decorate([
    UseGuards(SessionGuard),
    Get('/user/permissions'),
    Render('admin/user/permissions'),
    __param(0, Query()),
    __param(1, Query('sortBy')),
    __param(2, Query('sortOrder')),
    __param(3, Req()),
    __param(4, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaginationQueryDto, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllPermission", null);
__decorate([
    UseGuards(SessionGuard),
    Get('/user/sync-permissions'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "syncPermissions", null);
__decorate([
    UseGuards(SessionGuard),
    Post('/user/change-permission-name'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePermissionName", null);
__decorate([
    Post('/user/permission/change-status/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateStatus", null);
__decorate([
    UseGuards(SessionGuard),
    Get('/user/role/add'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addRole", null);
__decorate([
    UseGuards(SessionGuard),
    Get('/user/role/edit/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "editRole", null);
__decorate([
    Post('/user-role/save'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "saveUserRole", null);
__decorate([
    Post('/user-role/update/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserRole", null);
__decorate([
    UseGuards(SessionGuard),
    Get('/user/roles'),
    Render('admin/user/roles'),
    __param(0, Query()),
    __param(1, Query('sortBy')),
    __param(2, Query('sortOrder')),
    __param(3, Req()),
    __param(4, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaginationQueryDto, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "userRoles", null);
__decorate([
    UseGuards(SessionGuard),
    Post('/user/role/change-status/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateRoleStatus", null);
__decorate([
    UseGuards(SessionGuard),
    Get('/users'),
    Render('admin/user/users'),
    __param(0, Query()),
    __param(1, Query('sortBy')),
    __param(2, Query('sortOrder')),
    __param(3, Req()),
    __param(4, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaginationQueryDto, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "users", null);
__decorate([
    UseGuards(SessionGuard),
    Get('/user/add'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addUser", null);
__decorate([
    UseGuards(SessionGuard),
    Post('/user/save'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "saveUser", null);
__decorate([
    UseGuards(SessionGuard),
    Get('/user/edit/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "editUser", null);
__decorate([
    UseGuards(SessionGuard),
    Post('/user/update/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    UseGuards(SessionGuard),
    Post('/user/change-status/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserStatus", null);
__decorate([
    UseGuards(SessionGuard),
    Get('/user/profile'),
    Render('admin/user/profile'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "profile", null);
UserController = __decorate([
    ApiExcludeController(),
    Controller('admin'),
    __metadata("design:paramtypes", [UserService])
], UserController);
export { UserController };
//# sourceMappingURL=user.controller.js.map