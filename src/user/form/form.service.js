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
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from "../../schemas/category.schema";
import { FieldType } from "../../schemas/fieldtype.schema";
import { Form } from "../../schemas/form.schema";
let FormService = class FormService {
    categoryModel;
    fieldTypeModel;
    formModel;
    constructor(categoryModel, fieldTypeModel, formModel) {
        this.categoryModel = categoryModel;
        this.fieldTypeModel = fieldTypeModel;
        this.formModel = formModel;
    }
    async getAllCategories() {
        const sortCriteria = { ['name']: 1 };
        return this.categoryModel
            .find({ status: true }, 'name _id')
            .sort(sortCriteria)
            .lean()
            .exec();
    }
    async getAllFields() {
        const sortCriteria = {};
        return this.fieldTypeModel
            .find({ status: true }, 'name type')
            .sort(sortCriteria)
            .lean()
            .exec();
    }
    async create(jsonData) {
        try {
            return await this.formModel.create(jsonData);
        }
        catch (error) {
            throw new BadRequestException(error?.message || 'Data not saved');
        }
    }
    async getAllForms(paginationQuery, sortBy, sortOrder) {
        const { limit, search, page = 1 } = paginationQuery;
        const sortCriteria = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const query = search ? { title: new RegExp(search, 'i') } : {};
        const l = limit || 5;
        const ofs = ((page - 1) * l);
        try {
            return this.formModel
                .find(query)
                .skip(ofs)
                .limit(l)
                .sort(sortCriteria)
                .populate('category')
                .lean()
                .exec();
        }
        catch (error) {
            throw new BadRequestException(error?.message || 'NO data');
        }
    }
    async getPaginatedForms(limit, page) {
        const total = await this.formModel.countDocuments().exec();
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
    async editForm(jsonData, id) {
        try {
            return await this.formModel.findByIdAndUpdate(id, jsonData);
        }
        catch (error) {
            throw new ConflictException(error?.message || 'Data not saved');
        }
    }
    async getForm(id) {
        const d = await this.formModel
            .findById(id)
            .lean()
            .exec();
        return d;
    }
};
FormService = __decorate([
    Injectable(),
    __param(0, InjectModel(Category.name)),
    __param(1, InjectModel(FieldType.name)),
    __param(2, InjectModel(Form.name)),
    __metadata("design:paramtypes", [Model,
        Model,
        Model])
], FormService);
export { FormService };
//# sourceMappingURL=form.service.js.map