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
import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../../schemas/admin.schema';
import * as bcrypt from 'bcrypt';
import { Permission } from "../../schemas/permission.schema";
import { Role } from "../../schemas/role.schema";
let UserService = class UserService {
    adminModel;
    permissionModel;
    roleModel;
    constructor(adminModel, permissionModel, roleModel) {
        this.adminModel = adminModel;
        this.permissionModel = permissionModel;
        this.roleModel = roleModel;
    }
    async findLogin(email) {
        return (await this.adminModel.findOne({ email }).exec()).populate('role');
    }
    async signIn(username, pass) {
        try {
            const user = await this.findLogin(username);
            if (user) {
                const isMatch = await bcrypt.compare(pass, user?.password);
                //return isMatch;
                if (!isMatch) {
                    return { message: 'Password is not valid', status: 'error' };
                    // throw new BadRequestException('User name or password is not valid', { cause: new Error(), description: 'Invalid Credentials or worng password.' });
                }
                //delete user['password'];
                return { user: user, status: 'success' };
            }
            return { message: 'User name or password is not valid', status: 'error' };
            throw new BadRequestException('User name or password is not valid', { cause: new Error(), description: 'Invalid Credentials, please retry.' });
        }
        catch (error) {
            return { message: 'User name or password is not valid', status: 'error' };
            throw new BadRequestException(error.message, { cause: new Error(), description: 'Invalid Credentials, please retry.' });
        }
    }
    async saveAllRoutes(jsonData) {
        jsonData.forEach(async (element) => {
            const exist = await this.permissionModel.findOne({ path: element?.path }).lean().exec();
            console.log(exist, 'exist data');
            if (exist) {
                const c = await this.permissionModel.findByIdAndUpdate(exist._id, { path: element?.path, method: element?.method });
                console.log(c, 'update data');
            }
            else {
                const c = await this.permissionModel.create(element);
                console.log(c, 'save data');
            }
        });
    }
    async getAllPermissions(paginationQuery, sortBy, sortOrder) {
        const { limit, search, page = 1 } = paginationQuery;
        const sortCriteria = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const query = search ? { title: new RegExp(search, 'i') } : {};
        const l = limit || 20;
        const ofs = ((page - 1) * l);
        return this.permissionModel
            .find(query)
            .skip(ofs)
            .limit(l)
            .sort(sortCriteria)
            .lean()
            .exec();
    }
    async getPaginatedPermission(limit, page) {
        const total = await this.permissionModel.countDocuments().exec();
        const totalPages = Math.ceil(total / limit);
        const usedPage = String(page);
        const paginationData = {
            limit: limit,
            page: page,
            totalPages,
            pageMinusOne: parseInt(usedPage) - 1,
            pagePlusOne: parseInt(usedPage) + 1,
            pages: Array.from({ length: totalPages }, (_, i) => i + 1)
        };
        return paginationData;
    }
    async updatePermission(jsonData, id) {
        try {
            return await this.permissionModel.findByIdAndUpdate(id, jsonData);
        }
        catch (error) {
            throw new ConflictException(error?.message || 'Data not saved');
        }
    }
    async getPermission(id) {
        try {
            return await this.permissionModel.findById(id).lean().exec();
        }
        catch (error) {
            throw new ConflictException(error?.message || 'No Data');
        }
    }
    async getAllUserPermissions() {
        try {
            const sortCriteria = { ['name']: 1 };
            return await this.permissionModel.find({ status: true }).sort(sortCriteria).lean().exec();
        }
        catch (error) {
            throw new ConflictException(error?.message || 'No Data');
        }
    }
    async getAllSelectedPermissions(ids) {
        try {
            return await this.permissionModel.find({ _id: { $in: ids }, status: true }).lean().exec();
        }
        catch (error) {
            throw new ConflictException(error?.message || 'No Data');
        }
    }
    async saveRole(jsonData) {
        try {
            return await this.roleModel.create(jsonData);
        }
        catch (error) {
            throw new ConflictException(error?.message || 'Data not saved');
        }
    }
    async getAllRoles(paginationQuery, sortBy, sortOrder) {
        const { limit, search, page = 1 } = paginationQuery;
        const sortCriteria = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const query = search ? { title: new RegExp(search, 'i') } : {};
        const l = limit || 5;
        const ofs = ((page - 1) * l);
        return this.roleModel.find(query)
            .skip(ofs)
            .limit(l)
            .sort(sortCriteria)
            .lean()
            .exec();
    }
    async getPaginatedRoles(limit, page) {
        const total = await this.roleModel.countDocuments().exec();
        const totalPages = Math.ceil(total / limit);
        const usedPage = String(page);
        const paginationData = {
            limit: limit,
            page: page,
            totalPages,
            pageMinusOne: parseInt(usedPage) - 1,
            pagePlusOne: parseInt(usedPage) + 1,
            pages: Array.from({ length: totalPages }, (_, i) => i + 1)
        };
        return paginationData;
    }
    async getRole(id) {
        try {
            return await this.roleModel.findById(id).lean().exec();
        }
        catch (error) {
            throw new ConflictException(error?.message || 'No Data');
        }
    }
    async updateRole(jsonData, id) {
        try {
            return await this.roleModel.findByIdAndUpdate(id, jsonData);
        }
        catch (error) {
            throw new ConflictException(error?.message || 'Data not saved');
        }
    }
    async getRoles() {
        try {
            return await this.roleModel.find({}, '_id name').lean().exec();
        }
        catch (error) {
            throw new ConflictException(error?.message || 'No Data');
        }
    }
    async createUser(jsonData) {
        try {
            return await this.adminModel.create(jsonData);
        }
        catch (error) {
            throw new ConflictException(error?.message || 'Data not saved');
        }
    }
    async getAllUsers(paginationQuery, sortBy, sortOrder) {
        const { limit, search, page = 1 } = paginationQuery;
        const sortCriteria = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const query = search ? { title: new RegExp(search, 'i') } : {};
        const l = limit || 5;
        const ofs = ((page - 1) * l);
        return this.adminModel.find(query)
            .skip(ofs)
            .limit(l)
            .sort(sortCriteria)
            .lean()
            .exec();
    }
    async getPaginatedUsers(limit, page) {
        const total = await this.adminModel.countDocuments().exec();
        const totalPages = Math.ceil(total / limit);
        const usedPage = String(page);
        const paginationData = {
            limit: limit,
            page: page,
            totalPages,
            pageMinusOne: parseInt(usedPage) - 1,
            pagePlusOne: parseInt(usedPage) + 1,
            pages: Array.from({ length: totalPages }, (_, i) => i + 1)
        };
        return paginationData;
    }
    async getUser(id) {
        try {
            return await this.adminModel.findById(id).lean().exec();
        }
        catch (error) {
            throw new ConflictException(error?.message || 'No Data');
        }
    }
    async updateUser(jsonData, id) {
        try {
            return await this.adminModel.findByIdAndUpdate(id, jsonData);
        }
        catch (error) {
            throw new ConflictException(error?.message || 'Data not updated');
        }
    }
};
UserService = __decorate([
    Injectable(),
    __param(0, InjectModel(Admin.name)),
    __param(1, InjectModel(Permission.name)),
    __param(2, InjectModel(Role.name)),
    __metadata("design:paramtypes", [Model,
        Model,
        Model])
], UserService);
export { UserService };
//# sourceMappingURL=user.service.js.map