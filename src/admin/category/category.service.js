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
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FieldType } from "../../schemas/fieldtype.schema";
import { CreateListingTypeDto } from "../../dto/create-listingtype.dto";
import { CreateCategoryDto } from "../../dto/create-category.dto";
import { Category } from "../../schemas/category.schema";
const types = {
    1: 'Classified',
    2: 'Job offer',
    3: 'Job search',
    4: 'Rent',
    5: 'Not salable:'
};
let CategoryService = class CategoryService {
    listingTypeModel;
    categoryModel;
    constructor(listingTypeModel, categoryModel) {
        this.listingTypeModel = listingTypeModel;
        this.categoryModel = categoryModel;
    }
    async create(jsonData) {
        try {
            const createListingTypeDto = plainToInstance(CreateListingTypeDto, jsonData);
            const createdType = new this.listingTypeModel(createListingTypeDto);
            return await createdType.save();
        }
        catch (error) {
            throw new ConflictException(error?.message || 'Data not saved');
            //return error?.message||'Data not saved'
        }
    }
    async findAll(paginationQuery, sortBy, sortOrder, limit) {
        const { search, page = 1 } = paginationQuery;
        const sortCriteria = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const query = search ? { title: new RegExp(search, 'i') } : {};
        const l = limit || 5;
        const ofs = ((page - 1) * l);
        // console.log("paginationQuery",page,ofs,l);
        return this.listingTypeModel
            .find(query)
            .skip(ofs)
            .limit(l)
            .sort(sortCriteria)
            .lean()
            .exec();
    }
    async findAllCates(paginationQuery, sortBy, sortOrder) {
        const { limit, search, page = 1 } = paginationQuery;
        const sortCriteria = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const query = search ? { title: new RegExp(search, 'i') } : {};
        const l = limit || 5;
        const ofs = ((page - 1) * l);
        return this.categoryModel
            .find(query)
            .skip(ofs)
            .limit(l)
            .sort(sortCriteria)
            .lean()
            .exec();
    }
    async getPaginatedCategories(limit, page) {
        const total = await this.categoryModel.countDocuments().exec();
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
    async count(paginationQuery) {
        const { search } = paginationQuery;
        const query = search ? { title: new RegExp(search, 'i') } : {};
        return this.listingTypeModel.countDocuments(query).exec();
    }
    async getPaginatedListingType(limit, page) {
        const offset = (page - 1) * limit;
        const users = await this.listingTypeModel.find().skip(offset).limit(limit).lean().exec();
        const total = await this.listingTypeModel.countDocuments().exec();
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
    async deletedById(id) {
        return this.listingTypeModel.findByIdAndDelete(id).exec();
    }
    async getAllTypes() {
        return types;
    }
    async createCategory(jsonData) {
        const createCategoryDto = plainToInstance(CreateCategoryDto, jsonData);
        const createdCat = new this.categoryModel(createCategoryDto);
        try {
            return await createdCat.save();
        }
        catch (error) {
            //console.log(error,'not save data');
            throw new ConflictException(error?.message || 'Data not saved');
        }
    }
    async editCategory(jsonData, id) {
        const createCategoryDto = plainToInstance(CreateCategoryDto, jsonData);
        try {
            return await this.categoryModel.findByIdAndUpdate(id, createCategoryDto);
        }
        catch (error) {
            throw new ConflictException(error?.message || 'Data not saved');
        }
    }
    async getCatType(id) {
        return this.listingTypeModel
            .findById(id, 'name')
            .lean()
            .exec();
    }
    async getAllcats() {
        return this.categoryModel
            .find({ parentId: null }, 'name _id')
            .lean()
            .exec();
    }
    async getCat(id) {
        const d = await this.categoryModel
            .findById(id)
            .lean()
            .exec();
        return d;
    }
    async deletedCategoryById(id) {
        return this.categoryModel.findByIdAndDelete(id).exec();
    }
};
CategoryService = __decorate([
    Injectable(),
    __param(0, InjectModel(FieldType.name)),
    __param(1, InjectModel(Category.name)),
    __metadata("design:paramtypes", [Model,
        Model])
], CategoryService);
export { CategoryService };
//# sourceMappingURL=category.service.js.map