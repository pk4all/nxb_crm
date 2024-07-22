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
import { Controller, Get, Post, Param, UseGuards, Render, Query, HttpStatus, Res, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PageService } from './page.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { ApiExcludeController } from '@nestjs/swagger';
import { PaginationQueryDto } from "../../dto/pagination-query.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
let PageController = class PageController {
    pageService;
    constructor(pageService) {
        this.pageService = pageService;
    }
    async allpages(paginationQuery, sortBy = 'createdAt', sortOrder = 'desc', req) {
        try {
            const { page = 1, limit = 5 } = paginationQuery;
            const pages = await this.pageService.getAllPages(paginationQuery, sortBy, sortOrder);
            ;
            const pagination = await this.pageService.getPaginatedPage(limit, page);
            return { layout: 'admin', pagination, pages };
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
    }
    add() {
        return { layout: 'admin' };
    }
    async edit(id, req, res) {
        try {
            const page = await this.pageService.getPage(id);
            return { layout: 'admin', page, id };
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
    }
    async create(req, res, file) {
        try {
            var data = req?.body || {};
            if (file) {
                data.image = file?.filename;
            }
            if (data.status == 'on') {
                data.status = true;
            }
            else {
                data.status = false;
            }
            const page = await this.pageService.create(data);
            res.json({ status: 'success', message: 'Page successfully created.', data: page });
        }
        catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
    async update(id, req, res, file) {
        try {
            var data = req?.body || {};
            if (file) {
                data.image = file?.filename;
            }
            if (data.status == 'on') {
                data.status = true;
            }
            else {
                data.status = false;
            }
            const page = await this.pageService.updatePage(data, id);
            res.json({ status: 'success', message: 'Page successfully Updated.', data: page });
        }
        catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
    async deleteType(id, req, res) {
        try {
            const deleted = await this.pageService.deletedById(id);
            if (!deleted) {
                req.session.flash = {
                    error: HttpStatus.NOT_FOUND,
                };
                return res.redirect('/admin/pages');
            }
            req.session.flash = {
                success: 'Page deleted successfully',
            };
            return res.redirect('/admin/pages');
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
            return res.redirect('/admin/pages');
        }
    }
    async updateStatus(id, req, res) {
        var data = req?.body || {};
        try {
            const pageData = await this.pageService.getPage(id);
            if (pageData?.status) {
                pageData.status = false;
            }
            else {
                pageData.status = true;
            }
            await this.pageService.updatePage({ status: pageData.status }, id);
            res.json({ status: 'success', message: 'Category status changed successfully.' });
        }
        catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
};
__decorate([
    Get('/pages'),
    Render('admin/page/pages'),
    __param(0, Query()),
    __param(1, Query('sortBy')),
    __param(2, Query('sortOrder')),
    __param(3, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaginationQueryDto, String, String, Object]),
    __metadata("design:returntype", Promise)
], PageController.prototype, "allpages", null);
__decorate([
    Get('/page/add'),
    Render('admin/page/add_page'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PageController.prototype, "add", null);
__decorate([
    Get('/page/edit/:id'),
    Render('admin/page/edit_page'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PageController.prototype, "edit", null);
__decorate([
    Post('/page/create'),
    UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './public/uploads/page',
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
], PageController.prototype, "create", null);
__decorate([
    Post('/page/update/:id'),
    UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './public/uploads/page',
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
], PageController.prototype, "update", null);
__decorate([
    UseGuards(SessionGuard),
    Post('/page/delete/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PageController.prototype, "deleteType", null);
__decorate([
    Post('/page/change-status/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PageController.prototype, "updateStatus", null);
PageController = __decorate([
    ApiExcludeController(),
    UseGuards(SessionGuard),
    Controller('admin'),
    __metadata("design:paramtypes", [PageService])
], PageController);
export { PageController };
//# sourceMappingURL=page.controller.js.map