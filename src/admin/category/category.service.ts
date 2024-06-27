import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ListingType } from 'src/schemas/listingtype.schema';
import { CreateListingTypeDto } from 'src/dto/create-listingtype.dto';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(ListingType.name) private listingTypeModel: Model<ListingType>
      ) {
        
      }
    async create(jsonData: any) {
        try {
            const createListingTypeDto = plainToInstance(CreateListingTypeDto, jsonData);
            const createdCat = new this.listingTypeModel(createListingTypeDto);
            return await createdCat.save();
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

    async count(paginationQuery: PaginationQueryDto): Promise<number> {
        const { search } = paginationQuery;
        const query = search ? { title: new RegExp(search, 'i') } : {};
        return this.listingTypeModel.countDocuments(query).exec();
    }
    async getPaginatedUsers(limit: number, page: number): Promise<any> {
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
        return this.listingTypeModel
          .find({},'name _id')
          .lean()
          .exec();
    }

}
