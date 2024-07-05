import { Injectable,ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { Ads } from 'src/schemas/ads.schema';

@Injectable()
export class AdsService {
    constructor(
        @InjectModel(Ads.name) private adsModel: Model<Ads>,
      ){}

      async create(jsonData:any) {
        try {
          return await this.adsModel.create(jsonData);
        } catch (error) {
          throw new ConflictException(error?.message||'Data not saved');
        }
      }
    
      async getAllAds(paginationQuery: PaginationQueryDto,sortBy: string, sortOrder: string): Promise<Ads[]>{
        const { limit, search,page=1} = paginationQuery;
        const sortCriteria:any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const query = search ? { title: new RegExp(search, 'i') } : {};
        const l = limit||5;
        const ofs = ((page-1)*l);
        return this.adsModel
          .find(query)
          .skip(ofs)
          .limit(l)
          .sort(sortCriteria)
          .lean()
          .exec();
      }
    
      async getPaginatedAds(limit: number, page: number): Promise<any> {
          const total = await this.adsModel.countDocuments().exec();
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
    
      async update(jsonData:any,id){
        try {
           //console.log(jsonData,id);
          return  await this.adsModel.findByIdAndUpdate(id,jsonData);
        } catch (error) {
          throw new ConflictException(error?.message||'Data not saved');
        }
      }
    
      async getAds(id:string){
        try {
          return await this.adsModel.findById(id).lean().exec();
        } catch (error) {
          throw new ConflictException(error?.message||'No Data');
        }
      }
    
      async deletedById(id:string){
          return this.adsModel.findByIdAndDelete(id).exec();
      }
}
