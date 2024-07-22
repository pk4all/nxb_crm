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
import { Controller, Get, Post, Render, Res, Req, UseGuards, Query, Param, HttpStatus, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { PaginationQueryDto } from "../../dto/pagination-query.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import sharp from 'sharp';
let CategoryController = class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async categories(paginationQuery, sortBy = 'createdAt', sortOrder = 'desc', req) {
        try {
            const { page = 1, limit = 5 } = paginationQuery;
            const categories = await this.categoryService.findAllCates(paginationQuery, sortBy, sortOrder);
            ;
            const pagination = await this.categoryService.getPaginatedCategories(limit, page);
            console.log(pagination);
            return { layout: 'admin', pagination, categories };
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
    }
    async addCategory(req, res) {
        const types = await this.categoryService.getAllTypes();
        const allTypes = Object.keys(types).map(key => ({ key, value: types[key] }));
        const allCats = await this.categoryService.getAllcats();
        return { layout: 'admin', allTypes, allCats };
    }
    async editCategory(id, req, res) {
        const categoryData = await this.categoryService.getCat(id);
        const types = await this.categoryService.getAllTypes();
        const allTypes = Object.keys(types).map(key => ({ key, value: types[key] }));
        const allCats = await this.categoryService.getAllcats();
        //     const cfd = categoryData['customFields'];
        //     const jsonItems = categoryData['customFields'].map(item => item);
        //    console.log(jsonItems);
        return { layout: 'admin', allTypes, allCats, categoryData: categoryData, id };
    }
    async getCategoryCustomFields(id, req, res) {
        const categoryData = await this.categoryService.getCat(id);
        const customFields = categoryData['customFields'];
        res.json(customFields);
    }
    async saveCategory(req, res, file) {
        try {
            var data = req?.body || {};
            if (file) {
                const watermarkPath = 'public/watermark.png';
                const outputFilePath = 'public/uploads/category/adolaa-' + `${file.filename}`;
                await sharp(file.path)
                    .composite([{ input: watermarkPath, gravity: 'southeast' }])
                    .toFile(outputFilePath);
                fs.unlinkSync(file.path);
                data.image = 'adolaa-' + file?.filename;
            }
            if (data?.customFields) {
                var cfd = JSON.parse(data?.customFields);
                data.customFields = cfd.map(elm => {
                    elm.fieldKey = elm?.fieldName.toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
                    return elm;
                });
            }
            if (data?.parentId) {
                const c = await this.categoryService.getCat(data?.parentId);
                data.parentName = c?.name;
            }
            else {
                data.parentId = null;
            }
            if (data?.typeId) {
                const c = await this.categoryService.getAllTypes();
                data.typeName = c[data?.typeId];
            }
            else {
                data.parentId = null;
            }
            if (data.status == 'on') {
                data.status = true;
            }
            else {
                data.status = false;
            }
            if (data.icon == 'empty') {
                data.icon = '';
            }
            const cat = await this.categoryService.createCategory(data);
            res.json({ status: 'success', message: 'Category successfully created.', data: cat });
        }
        catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
    async saveEditCategory(id, req, res, file) {
        try {
            //const categoryData = await this.categoryService.getCat(id);
            var data = req?.body || {};
            if (file) {
                const watermarkPath = 'public/watermark.png';
                const outputFilePath = 'public/uploads/category/adolaa-' + `${file.filename}`;
                await sharp(file.path)
                    .composite([{ input: watermarkPath, gravity: 'southeast' }])
                    .toFile(outputFilePath);
                fs.unlinkSync(file.path);
                data.image = 'adolaa-' + file?.filename;
            }
            if (data?.customFields) {
                var cfd = JSON.parse(data?.customFields);
                data.customFields = cfd.map(elm => {
                    elm.fieldKey = elm?.fieldName.toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
                    return elm;
                });
            }
            if (data?.parentId) {
                const c = await this.categoryService.getCat(data?.parentId);
                data.parentName = c?.name;
            }
            else {
                data.parentId = null;
            }
            if (data?.typeId) {
                const c = await this.categoryService.getAllTypes();
                data.typeName = c[data?.typeId];
            }
            else {
                data.parentId = null;
            }
            if (data.status == 'on') {
                data.status = true;
            }
            else {
                data.status = false;
            }
            const cat = await this.categoryService.editCategory(data, id);
            res.json({ status: 'success', message: 'Category successfully edited.', data: cat });
        }
        catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
    async updateStatus(id, req, res) {
        var data = req?.body || {};
        console.log(data, id);
        try {
            const categoryData = await this.categoryService.getCat(id);
            if (categoryData?.status) {
                categoryData.status = false;
            }
            else {
                categoryData.status = true;
            }
            await this.categoryService.editCategory({ status: categoryData.status }, id);
            res.json({ status: 'success', message: 'Category status changed successfully.' });
        }
        catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
    async deleteCategory(id, req, res) {
        try {
            const deleted = await this.categoryService.deletedCategoryById(id);
            if (!deleted) {
                req.session.flash = {
                    error: HttpStatus.NOT_FOUND,
                };
                return res.redirect('/admin/categories');
            }
            req.session.flash = {
                success: 'Category successfully deleted',
            };
            return res.redirect('/admin/categories');
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
            return res.redirect('/admin/categories');
        }
    }
    async listingTypes(paginationQuery, sortBy = 'createdAt', sortOrder = 'desc', req) {
        try {
            const { page = 1, limit = 15 } = paginationQuery;
            const listingTypes = await this.categoryService.findAll(paginationQuery, sortBy, sortOrder, limit);
            const pagination = await this.categoryService.getPaginatedListingType(limit, page);
            return { listingTypes, pagination, layout: 'admin' };
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
    }
    async addListingType(req, res) {
        return { layout: 'admin' };
    }
    async saveListingType(req, res) {
        try {
            var data = req?.body || {};
            data.status = 1;
            const lt = await this.categoryService.create(data);
            req.session.flash = {
                success: 'field Type add successfully',
            };
            return res.redirect('/admin/field-types');
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
            return res.redirect('/admin/field-type/add');
        }
    }
    async deleteType(id, req, res) {
        try {
            const deleted = await this.categoryService.deletedById(id);
            if (!deleted) {
                req.session.flash = {
                    error: HttpStatus.NOT_FOUND,
                };
                return res.redirect('/admin/field-types');
            }
            req.session.flash = {
                success: 'Listing Type deleted successfully',
            };
            return res.redirect('/admin/field-types');
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
            return res.redirect('/admin/field-types');
        }
    }
};
__decorate([
    UseGuards(SessionGuard),
    Get('/categories'),
    Render('admin/category/categories_list'),
    __param(0, Query()),
    __param(1, Query('sortBy')),
    __param(2, Query('sortOrder')),
    __param(3, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaginationQueryDto, String, String, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "categories", null);
__decorate([
    UseGuards(SessionGuard),
    Get('/category/add'),
    Render('admin/category/add_category'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "addCategory", null);
__decorate([
    UseGuards(SessionGuard),
    Get('/category/edit/:id'),
    Render('admin/category/edit_category'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "editCategory", null);
__decorate([
    Get('/category/get-custom-fields/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getCategoryCustomFields", null);
__decorate([
    UseGuards(SessionGuard),
    Post('/category/save'),
    UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './public/uploads/category',
            filename: (req, file, cb) => {
                const filename = path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
                const extension = path.parse(file.originalname).ext;
                cb(null, `${filename}${extension}`);
            },
        }),
    })),
    __param(0, Req()),
    __param(1, Res()),
    __param(2, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "saveCategory", null);
__decorate([
    UseGuards(SessionGuard),
    Post('/category/saveEdit/:id'),
    UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './public/uploads/category',
            filename: (req, file, cb) => {
                const filename = path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
                const extension = path.parse(file.originalname).ext;
                cb(null, `${filename}${extension}`);
            },
        }),
    })),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __param(3, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "saveEditCategory", null);
__decorate([
    UseGuards(SessionGuard),
    Post('/category/change-status/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "updateStatus", null);
__decorate([
    UseGuards(SessionGuard),
    Post('/delete-category/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "deleteCategory", null);
__decorate([
    UseGuards(SessionGuard),
    Get('/field-types'),
    Render('admin/category/field_type_list'),
    __param(0, Query()),
    __param(1, Query('sortBy')),
    __param(2, Query('sortOrder')),
    __param(3, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaginationQueryDto, String, String, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "listingTypes", null);
__decorate([
    UseGuards(SessionGuard),
    Get('/field-type/add'),
    Render('admin/category/add_field_type'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "addListingType", null);
__decorate([
    UseGuards(SessionGuard),
    Post('/field-type/save'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "saveListingType", null);
__decorate([
    UseGuards(SessionGuard),
    Post('/delete-field-type/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "deleteType", null);
CategoryController = __decorate([
    ApiExcludeController(),
    Controller('admin'),
    __metadata("design:paramtypes", [CategoryService])
], CategoryController);
export { CategoryController };
//# sourceMappingURL=category.controller.js.map