import { Injectable,ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { Faq } from 'src/schemas/faq.schema';
@Injectable()
export class FaqService {
  constructor(
    @InjectModel(Faq.name) private faqModel: Model<Faq>,
  ){}
  async create(jsonData:any) {
    try {
       // console.log(jsonData);
      return await this.faqModel.create(jsonData);
    } catch (error) {
      throw new ConflictException(error?.message||'Data not saved');
    }
  }

  async getAllFaqs(paginationQuery: PaginationQueryDto,sortBy: string, sortOrder: string): Promise<Faq[]>{
    const { limit, search,page=1} = paginationQuery;
    const sortCriteria:any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const query = search ? { title: new RegExp(search, 'i') } : {};
    const l = limit||5;
    const ofs = ((page-1)*l);
    return this.faqModel
      .find(query)
      .skip(ofs)
      .limit(l)
      .sort(sortCriteria)
      .lean()
      .exec();
  }

  async getPaginatedFaq(limit: number, page: number): Promise<any> {
      const total = await this.faqModel.countDocuments().exec();
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

  async updateFaq(jsonData:any,id){
    try {
      //  console.log(jsonData,id);
      return  await this.faqModel.findByIdAndUpdate(id,jsonData);
    } catch (error) {
      throw new ConflictException(error?.message||'Data not saved');
    }
  }

  async getFaq(id:string){
    try {
      return await this.faqModel.findById(id).lean().exec();
    } catch (error) {
      throw new ConflictException(error?.message||'No Data');
    }
  }

  async deletedById(id:string){
      return this.faqModel.findByIdAndDelete(id).exec();
  }
}
