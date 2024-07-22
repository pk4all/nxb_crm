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
import { Controller, Get, Post, Body, Param, UseGuards, Render, Query, HttpStatus, Res, Req, } from '@nestjs/common';
import { FaqService } from './faq.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { ApiExcludeController } from '@nestjs/swagger';
import { PaginationQueryDto } from "../../dto/pagination-query.dto";
let FaqController = class FaqController {
    faqService;
    constructor(faqService) {
        this.faqService = faqService;
    }
    async allpages(paginationQuery, sortBy = 'createdAt', sortOrder = 'desc', req) {
        try {
            const { page = 1, limit = 5 } = paginationQuery;
            const faqs = await this.faqService.getAllFaqs(paginationQuery, sortBy, sortOrder);
            ;
            const pagination = await this.faqService.getPaginatedFaq(limit, page);
            return { layout: 'admin', pagination, faqs };
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
            const faq = await this.faqService.getFaq(id);
            return { layout: 'admin', faq, id };
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
    }
    async create(req, res) {
        try {
            var data = req?.body || {};
            if (data.status == 'on') {
                data.status = true;
            }
            else {
                data.status = false;
            }
            const faq = await this.faqService.create(data);
            res.json({ status: 'success', message: 'Faq successfully created.', data: faq });
        }
        catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
    async update(body, id, req, res) {
        try {
            var data = req?.body;
            if (data.status == 'on') {
                data.status = true;
            }
            else {
                data.status = false;
            }
            //console.log(data,'Data');
            const page = await this.faqService.updateFaq(data, id);
            res.json({ status: 'success', message: 'Faq successfully Updated.', data: page });
        }
        catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
    async deleteType(id, req, res) {
        try {
            const deleted = await this.faqService.deletedById(id);
            if (!deleted) {
                req.session.flash = {
                    error: HttpStatus.NOT_FOUND,
                };
                return res.redirect('/admin/faqs');
            }
            req.session.flash = {
                success: 'Faq deleted successfully',
            };
            return res.redirect('/admin/faqs');
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
            return res.redirect('/admin/faqs');
        }
    }
    async updateStatus(id, req, res) {
        var data = req?.body || {};
        try {
            const pageData = await this.faqService.getFaq(id);
            if (pageData?.status) {
                pageData.status = false;
            }
            else {
                pageData.status = true;
            }
            await this.faqService.updateFaq({ status: pageData.status }, id);
            res.json({ status: 'success', message: 'Faq status changed successfully.' });
        }
        catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
};
__decorate([
    Get('/faqs'),
    Render('admin/faq/faqs'),
    __param(0, Query()),
    __param(1, Query('sortBy')),
    __param(2, Query('sortOrder')),
    __param(3, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaginationQueryDto, String, String, Object]),
    __metadata("design:returntype", Promise)
], FaqController.prototype, "allpages", null);
__decorate([
    Get('/faq/add'),
    Render('admin/faq/add_faq'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FaqController.prototype, "add", null);
__decorate([
    Get('/faq/edit/:id'),
    Render('admin/faq/edit_faq'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FaqController.prototype, "edit", null);
__decorate([
    Post('/faq/create'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FaqController.prototype, "create", null);
__decorate([
    Post('/faq/update/:id'),
    __param(0, Body()),
    __param(1, Param('id')),
    __param(2, Req()),
    __param(3, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FaqController.prototype, "update", null);
__decorate([
    UseGuards(SessionGuard),
    Post('/faq/delete/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FaqController.prototype, "deleteType", null);
__decorate([
    Post('/faq/change-status/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FaqController.prototype, "updateStatus", null);
FaqController = __decorate([
    ApiExcludeController(),
    UseGuards(SessionGuard),
    Controller('admin'),
    __metadata("design:paramtypes", [FaqService])
], FaqController);
export { FaqController };
//# sourceMappingURL=faq.controller.js.map