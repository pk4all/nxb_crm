import { Injectable,ConflictException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ListingType } from 'src/schemas/listingtype.schema';
import { CreateListingTypeDto } from 'src/dto/create-listingtype.dto';
import { CreateCategoryDto } from 'src/dto/create-category.dto';
import { Category } from 'src/schemas/category.schema';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { MongoError } from 'mongodb';
const types = {
    1:'Classified',
    2:'Job offer',
    3:'Job search',
    4:'Rent',
    5:'Not salable:'
};
@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(ListingType.name) private listingTypeModel: Model<ListingType>,
        @InjectModel(Category.name) private categoryModel: Model<ListingType>
      ) {
        
      }
    async create(jsonData: any) {
        try {
            const createListingTypeDto = plainToInstance(CreateListingTypeDto, jsonData);
            const createdType = new this.listingTypeModel(createListingTypeDto);
            return await createdType.save();
        } catch (error) {
            return error?.message||'Data not saved'
        } 
    }

    async findAll(paginationQuery: PaginationQueryDto,sortBy: string, sortOrder: string): Promise<ListingType[]> {
        const { limit, search,page=1} = paginationQuery;
        const sortCriteria:any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const query = search ? { title: new RegExp(search, 'i') } : {};
        const l = limit||5;
        const ofs = ((page-1)*l);
       // console.log("paginationQuery",page,ofs,l);
        return this.listingTypeModel
          .find(query)
          .skip(ofs)
          .limit(l)
          .sort(sortCriteria)
          .lean()
          .exec();
    }

    async findAllCates(paginationQuery: PaginationQueryDto,sortBy: string, sortOrder: string): Promise<ListingType[]> {
        const { limit, search,page=1} = paginationQuery;
        const sortCriteria:any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const query = search ? { title: new RegExp(search, 'i') } : {};
        const l = limit||5;
        const ofs = ((page-1)*l);
        return this.categoryModel
          .find(query)
          .skip(ofs)
          .limit(l)
          .sort(sortCriteria)
          .lean()
          .exec();
    }

    async getPaginatedCategories(limit: number, page: number): Promise<any> {
        const total = await this.categoryModel.countDocuments().exec();
        const totalPages = Math.ceil(total / limit);
        const usedPage:string = String(page);
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

    async count(paginationQuery: PaginationQueryDto): Promise<number> {
        const { search } = paginationQuery;
        const query = search ? { title: new RegExp(search, 'i') } : {};
        return this.listingTypeModel.countDocuments(query).exec();
    }
    async getPaginatedListingType(limit: number, page: number): Promise<any> {
        const offset = (page - 1) * limit;
        const users = await this.listingTypeModel.find().skip(offset).limit(limit).lean().exec();
        const total = await this.listingTypeModel.countDocuments().exec();
        const totalPages = Math.ceil(total / limit);
        const usedPage:string = String(page);
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

    
    async deletedById(id: string): Promise<ListingType> {
        return this.listingTypeModel.findByIdAndDelete(id).exec();
    }
    

    async getAllTypes(){
        return types;
    }

    async createCategory(jsonData: any){
            const createCategoryDto = plainToInstance(CreateCategoryDto, jsonData);
            const createdCat = new this.categoryModel(createCategoryDto);
        try {
            return await createdCat.save();
        } catch (error) {
            //console.log(error,'not save data');
            throw new ConflictException(error?.message||'Data not saved');
        } 
    }
    async editCategory(jsonData:any,id:string){
        const createCategoryDto = plainToInstance(CreateCategoryDto, jsonData);
        try {
            return await this.categoryModel.findByIdAndUpdate(id,createCategoryDto);
        } catch (error) {
            throw new ConflictException(error?.message||'Data not saved');
        }
        
    }
    async getCatType(id){
        return this.listingTypeModel
          .findById(id,'name')
          .lean()
          .exec();
    }

    async getAllcats(){
        return this.categoryModel
          .find({parentId: null},'name _id')
          .lean()
          .exec();
    }
    async getCat(id){
         const d =  await this.categoryModel
          .findById(id)
          .lean()
          .exec();
          return d;

    }
    async deletedCategoryById(id: string): Promise<ListingType> {
        return this.categoryModel.findByIdAndDelete(id).exec();
    }
}