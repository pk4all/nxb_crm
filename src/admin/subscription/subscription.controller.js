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
import { SubscriptionService } from './subscription.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { ApiExcludeController } from '@nestjs/swagger';
import { PaginationQueryDto } from "../../dto/pagination-query.dto";
let SubscriptionController = class SubscriptionController {
    subscriptionService;
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    async allpages(paginationQuery, sortBy = 'createdAt', sortOrder = 'desc', req) {
        try {
            const { page = 1, limit = 5 } = paginationQuery;
            const subscriptions = await this.subscriptionService.getAllSubScriptions(paginationQuery, sortBy, sortOrder);
            ;
            const pagination = await this.subscriptionService.getPaginatedSubscriptions(limit, page);
            return { layout: 'admin', pagination, subscriptions };
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
            const subscription = await this.subscriptionService.getSubscription(id);
            return { layout: 'admin', subscription, id };
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
            const subscription = await this.subscriptionService.create(data);
            res.json({ status: 'success', message: 'Subscription successfully created.', data: subscription });
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
            const subscription = await this.subscriptionService.update(data, id);
            res.json({ status: 'success', message: 'Subscription successfully Updated.', data: subscription });
        }
        catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
    async deleteType(id, req, res) {
        try {
            const deleted = await this.subscriptionService.deletedById(id);
            if (!deleted) {
                req.session.flash = {
                    error: HttpStatus.NOT_FOUND,
                };
                return res.redirect('/admin/subscriptions');
            }
            req.session.flash = {
                success: 'Subscription deleted successfully',
            };
            return res.redirect('/admin/subscriptions');
        }
        catch (error) {
            req.session.flash = {
                error: error.message,
            };
            return res.redirect('/admin/subscriptions');
        }
    }
    async updateStatus(id, req, res) {
        var data = req?.body || {};
        try {
            const data = await this.subscriptionService.getSubscription(id);
            if (data?.status) {
                data.status = false;
            }
            else {
                data.status = true;
            }
            await this.subscriptionService.update({ status: data.status }, id);
            res.json({ status: 'success', message: 'Subscription status changed successfully.' });
        }
        catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
};
__decorate([
    Get('/subscriptions'),
    Render('admin/subscription/subscription_list'),
    __param(0, Query()),
    __param(1, Query('sortBy')),
    __param(2, Query('sortOrder')),
    __param(3, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaginationQueryDto, String, String, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "allpages", null);
__decorate([
    Get('/subscription/add'),
    Render('admin/subscription/add_subscription'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "add", null);
__decorate([
    Get('/subscription/edit/:id'),
    Render('admin/subscription/edit_subscription'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "edit", null);
__decorate([
    Post('/subscription/create'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "create", null);
__decorate([
    Post('/subscription/update/:id'),
    __param(0, Body()),
    __param(1, Param('id')),
    __param(2, Req()),
    __param(3, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "update", null);
__decorate([
    UseGuards(SessionGuard),
    Post('/subscription/delete/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "deleteType", null);
__decorate([
    Post('/subscription/change-status/:id'),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "updateStatus", null);
SubscriptionController = __decorate([
    ApiExcludeController(),
    UseGuards(SessionGuard),
    Controller('admin'),
    __metadata("design:paramtypes", [SubscriptionService])
], SubscriptionController);
export { SubscriptionController };
//# sourceMappingURL=subscription.controller.js.map