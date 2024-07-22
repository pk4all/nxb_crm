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
import { Injectable, ConflictException } from '@nestjs/common';
import { Subscription } from "../../schemas/subscription.schema";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
let SubscriptionService = class SubscriptionService {
    subscriptionModel;
    constructor(subscriptionModel) {
        this.subscriptionModel = subscriptionModel;
    }
    async create(jsonData) {
        try {
            return await this.subscriptionModel.create(jsonData);
        }
        catch (error) {
            throw new ConflictException(error?.message || 'Data not saved');
        }
    }
    async getAllSubScriptions(paginationQuery, sortBy, sortOrder) {
        const { limit, search, page = 1 } = paginationQuery;
        const sortCriteria = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const query = search ? { title: new RegExp(search, 'i') } : {};
        const l = limit || 5;
        const ofs = ((page - 1) * l);
        return this.subscriptionModel
            .find(query)
            .skip(ofs)
            .limit(l)
            .sort(sortCriteria)
            .lean()
            .exec();
    }
    async getPaginatedSubscriptions(limit, page) {
        const total = await this.subscriptionModel.countDocuments().exec();
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
    async update(jsonData, id) {
        try {
            //console.log(jsonData,id);
            return await this.subscriptionModel.findByIdAndUpdate(id, jsonData);
        }
        catch (error) {
            throw new ConflictException(error?.message || 'Data not saved');
        }
    }
    async getSubscription(id) {
        try {
            return await this.subscriptionModel.findById(id).lean().exec();
        }
        catch (error) {
            throw new ConflictException(error?.message || 'No Data');
        }
    }
    async deletedById(id) {
        return this.subscriptionModel.findByIdAndDelete(id).exec();
    }
};
SubscriptionService = __decorate([
    Injectable(),
    __param(0, InjectModel(Subscription.name)),
    __metadata("design:paramtypes", [Model])
], SubscriptionService);
export { SubscriptionService };
//# sourceMappingURL=subscription.service.js.map