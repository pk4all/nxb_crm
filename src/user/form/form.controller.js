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
import { Controller, Post, Query, Get, Param, Render, UseGuards, UploadedFile, UseInterceptors, Req, Res, BadRequestException } from '@nestjs/common';
import { FormService } from './form.service';
import { UserSessionGuard } from "../../gaurds/user.session.guard";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { PaginationQueryDto } from "../../dto/pagination-query.dto";
let FormController = class FormController {
    formService;
    constructor(formService) {
        this.formService = formService;
    }
    async newForm() {
        return { layout: 'user' };
    }
    async editForm() {
        return { layout: 'user' };
    }
    async getForm(id) {
        const f = await this.formService.getForm(id);
        return f;
    }
    async formsList(paginationQuery, req) {
        try {
            const { page = 1, limit = 5 } = paginationQuery;
            //   const forms=await this.formService.getAllForms(paginationQuery,sortBy,sortOrder);;
            const pagination = await this.formService.getPaginatedForms(limit, page);
            //   console.log(forms,'all forms');
            return { layout: 'user', pagination };
        }
        catch (error) {
            console.log(error);
            req.session.flash = {
                error: error.message,
            };
        }
    }
    async formsListAll(paginationQuery, sortBy = 'createdAt', sortOrder = 'desc', req, res) {
        try {
            const { page = 1, limit = 5 } = paginationQuery;
            const forms = await this.formService.getAllForms(paginationQuery, sortBy, sortOrder);
            ;
            const pagination = await this.formService.getPaginatedForms(limit, page);
            console.log(forms, 'all forms');
            res.json({ status: 'success', data: forms, message: 'all data', pagination }).status(200);
        }
        catch (error) {
            console.log(error);
            req.session.flash = {
                error: error.message,
            };
            res.json({ status: 'success', message: error.message, data: '' });
        }
    }
    async updateStatus(id, req, res) {
        var data = req?.body || {};
        console.log(data, id);
        try {
            const formData = await this.formService.getForm(id);
            if (formData?.status) {
                formData.status = false;
            }
            else {
                formData.status = true;
            }
            await this.formService.editForm({ status: formData.status }, id);
            res.json({ status: 'success', message: 'Form status changed successfully.' });
        }
        catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
    async formCategories() {
        try {
            const allCats = await this.formService.getAllCategories();
            return { type: 'success', data: allCats };
        }
        catch (error) {
            return { type: 'error', message: error.message };
        }
    }
    async formFields() {
        try {
            const allDatas = await this.formService.getAllFields();
            return { data: allDatas };
        }
        catch (error) {
            return { type: 'error', message: error.message };
        }
    }
    async saveImage(req, res, file) {
        if (file) {
            res.json({ status: 'success', file: file.filename, data: file });
        }
        else {
            res.json({ status: 'error', message: 'no file' });
        }
    }
    async saveForm(id, req, res) {
        try {
            if (id) {
                var data = req?.body || {};
                if (data.visibility == true) {
                    data.visibility = 'private';
                }
                else {
                    data.visibility = 'public';
                }
                const f = await this.formService.editForm(data, id);
                res.json({ status: 'success', message: 'Form data successfuly saved.', data: f });
            }
            else {
                var data = req?.body || {};
                if (data.visibility == true) {
                    data.visibility = 'private';
                }
                else {
                    data.visibility = 'public';
                }
                const f = await this.formService.create(data);
                res.json({ status: 'success', message: 'Form data successfuly saved.', data: f });
            }
        }
        catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
};
__decorate([
    Get('/new-form'),
    Render('user/new_form'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormController.prototype, "newForm", null);
__decorate([
    Get('/edit/:id'),
    Render('user/edit_form'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormController.prototype, "editForm", null);
__decorate([
    Get('/getForm/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FormController.prototype, "getForm", null);
__decorate([
    Get('/list'),
    Render('user/form_list'),
    __param(0, Query()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaginationQueryDto, Object]),
    __metadata("design:returntype", Promise)
], FormController.prototype, "formsList", null);
__decorate([
    Get('/list/all'),
    __param(0, Query()),
    __param(1, Query('sortBy')),
    __param(2, Query('sortOrder')),
    __param(3, Req()),
    __param(4, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaginationQueryDto, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FormController.prototype, "formsListAll", null);
__decorate([
    Post('/change-status/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FormController.prototype, "updateStatus", null);
__decorate([
    Get('/form-categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormController.prototype, "formCategories", null);
__decorate([
    Get('/form-fields'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FormController.prototype, "formFields", null);
__decorate([
    Post('/save-file/'),
    UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './public/uploads/form/images',
            filename: (req, file, cb) => {
                const filename = path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
                const extension = path.parse(file.originalname).ext;
                cb(null, `${filename}${extension}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                return cb(new BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, Req()),
    __param(1, Res()),
    __param(2, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FormController.prototype, "saveImage", null);
__decorate([
    Post('/save-form/:id?'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FormController.prototype, "saveForm", null);
FormController = __decorate([
    UseGuards(UserSessionGuard),
    Controller('form'),
    __metadata("design:paramtypes", [FormService])
], FormController);
export { FormController };
//# sourceMappingURL=form.controller.js.map