import { Injectable,ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page } from 'src/schemas/page.schema';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';

@Injectable()
export class PageService {
  constructor(
    @InjectModel(Page.name) private pageModel: Model<Page>,
  ){}
  async create(jsonData:any) {
    try {
      return await this.pageModel.create(jsonData);
    } catch (error) {
      throw new ConflictException(error?.message||'Data not saved');
    }
  }

  async getAllPages(paginationQuery: PaginationQueryDto,sortBy: string, sortOrder: string): Promise<Page[]>{
    const { limit, search,page=1} = paginationQuery;
    const sortCriteria:any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const query = search ? { title: new RegExp(search, 'i') } : {};
    const l = limit||5;
    const ofs = ((page-1)*l);
    return this.pageModel
      .find(query)
      .skip(ofs)
      .limit(l)
      .sort(sortCriteria)
      .lean()
      .exec();
  }

  async getPaginatedPage(limit: number, page: number): Promise<any> {
      const total = await this.pageModel.countDocuments().exec();
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

  async updatePage(jsonData:any,id){
    try {
      return await this.pageModel.findByIdAndUpdate(id,jsonData);
    } catch (error) {
      throw new ConflictException(error?.message||'Data not saved');
    }
  }

  async getPage(id:string){
    try {
      return await this.pageModel.findById(id).lean().exec();
    } catch (error) {
      throw new ConflictException(error?.message||'No Data');
    }
  }

  async deletedById(id:string){
      return this.pageModel.findByIdAndDelete(id).exec();
  }
}
