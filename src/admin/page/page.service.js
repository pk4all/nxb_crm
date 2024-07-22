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
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page } from "../../schemas/page.schema";
let PageService = class PageService {
    pageModel;
    constructor(pageModel) {
        this.pageModel = pageModel;
    }
    async create(jsonData) {
        try {
            return await this.pageModel.create(jsonData);
        }
        catch (error) {
            throw new ConflictException(error?.message || 'Data not saved');
        }
    }
    async getAllPages(paginationQuery, sortBy, sortOrder) {
        const { limit, search, page = 1 } = paginationQuery;
        const sortCriteria = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const query = search ? { title: new RegExp(search, 'i') } : {};
        const l = limit || 5;
        const ofs = ((page - 1) * l);
        return this.pageModel
            .find(query)
            .skip(ofs)
            .limit(l)
            .sort(sortCriteria)
            .lean()
            .exec();
    }
    async getPaginatedPage(limit, page) {
        const total = await this.pageModel.countDocuments().exec();
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
    async updatePage(jsonData, id) {
        try {
            return await this.pageModel.findByIdAndUpdate(id, jsonData);
        }
        catch (error) {
            throw new ConflictException(error?.message || 'Data not saved');
        }
    }
    async getPage(id) {
        try {
            return await this.pageModel.findById(id).lean().exec();
        }
        catch (error) {
            throw new ConflictException(error?.message || 'No Data');
        }
    }
    async deletedById(id) {
        return this.pageModel.findByIdAndDelete(id).exec();
    }
};
PageService = __decorate([
    Injectable(),
    __param(0, InjectModel(Page.name)),
    __metadata("design:paramtypes", [Model])
], PageService);
export { PageService };
//# sourceMappingURL=page.service.js.map