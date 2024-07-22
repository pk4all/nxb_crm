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
import { Controller, Get, Post, Body, Param, UseGuards, Render, Query, HttpStatus, Res, Req } from '@nestjs/common';
import { AdsService } from './ads.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { ApiExcludeController } from '@nestjs/swagger';
import { PaginationQueryDto } from "../../dto/pagination-query.dto";
let AdsController = class AdsController {
    adsService;
    constructor(adsService) {
        this.adsService = adsService;
    }
    async allpages(paginationQuery, sortBy = 'createdAt', sortOrder = 'desc', req) {
        try {
            const { page = 1, limit = 5 } = paginationQuery;
            const ads = await this.adsService.getAllAds(paginationQuery, sortBy, sortOrder);
            ;
            const pagination = await this.adsService.getPaginatedAds(limit, page);
            return { layout: 'admin', pagination, ads };
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
            const ads = await this.adsService.getAds(id);
            return { layout: 'admin', ads, id };
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
            const ads = await this.adsService.create(data);
            res.json({ status: 'success', message: 'Ads successfully created.', data: ads });
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
            const ads = await this.adsService.update(data, id);
            res.json({ status: 'success', message: 'Ads successfully Updated.', data: ads });
        }
        catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
    async deleteType(id, req, res) {
        try {
            const deleted = await this.adsService.deletedById(id);
            if (!deleted) {
                req.session.flash = {
                    error: HttpStatus.NOT_FOUND,
                };
                return res.redirect('/admin/ads');
            }
            req.session.flash = {
                success: 'Ads deleted successfully',
            };
            return res.redirect('/admin/ads');
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
            return res.redirect('/admin/ads');
        }
    }
    async updateStatus(id, req, res) {
        var data = req?.body || {};
        try {
            const ads = await this.adsService.getAds(id);
            if (ads?.status) {
                ads.status = false;
            }
            else {
                ads.status = true;
            }
            await this.adsService.update({ status: ads.status }, id);
            res.json({ status: 'success', message: 'Ads status changed successfully.' });
        }
        catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
};
__decorate([
    Get('/ads'),
    Render('admin/ads/ads'),
    __param(0, Query()),
    __param(1, Query('sortBy')),
    __param(2, Query('sortOrder')),
    __param(3, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaginationQueryDto, String, String, Object]),
    __metadata("design:returntype", Promise)
], AdsController.prototype, "allpages", null);
__decorate([
    Get('/ads/add'),
    Render('admin/ads/add_ads'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "add", null);
__decorate([
    Get('/ads/edit/:id'),
    Render('admin/ads/edit_ads'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdsController.prototype, "edit", null);
__decorate([
    Post('/ads/create'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdsController.prototype, "create", null);
__decorate([
    Post('/ads/update/:id'),
    __param(0, Body()),
    __param(1, Param('id')),
    __param(2, Req()),
    __param(3, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdsController.prototype, "update", null);
__decorate([
    UseGuards(SessionGuard),
    Post('/ads/delete/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdsController.prototype, "deleteType", null);
__decorate([
    Post('/ads/change-status/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdsController.prototype, "updateStatus", null);
AdsController = __decorate([
    ApiExcludeController(),
    UseGuards(SessionGuard),
    Controller('admin'),
    __metadata("design:paramtypes", [AdsService])
], AdsController);
export { AdsController };
//# sourceMappingURL=ads.controller.js.map