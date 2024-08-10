import { Injectable,ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { EmailTemplate } from 'src/schemas/emailtemplate.schema';
import { Identitie } from 'src/schemas/identitie.schema';

@Injectable()
export class EmailTemplateService {
  constructor(
    @InjectModel(EmailTemplate.name) private model: Model<EmailTemplate>,
    @InjectModel(Identitie.name) private identitieModel: Model<Identitie>,
  ){}
  async create(jsonData:any) {
    try {
      return await this.model.create(jsonData);
    } catch (error) {
      throw new ConflictException(error?.message||'Data not saved');
    }
  }

  async getAllDatas(paginationQuery: PaginationQueryDto,sortBy: string, sortOrder: string): Promise<EmailTemplate[]>{
    const { limit, search,page=1} = paginationQuery;
    const sortCriteria:any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const query = search ? { title: new RegExp(search, 'i') } : {};
    const l = limit||5;
    const ofs = ((page-1)*l);
    return this.model
      .find(query)
      .skip(ofs)
      .limit(l)
      .sort(sortCriteria)
      .lean()
      .exec();
  }

  async getPaginated(limit: number, page: number): Promise<any> {
      const total = await this.model.countDocuments().exec();
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
      //  console.log(jsonData,id);
      return  await this.model.findByIdAndUpdate(id,jsonData);
    } catch (error) {
      throw new ConflictException(error?.message||'Data not saved');
    }
  }

  async getData(id:string){
    try {
      return await this.model.findById(id).lean().exec();
    } catch (error) {
      throw new ConflictException(error?.message||'No Data');
    }
  }

  async deletedById(id:string){
      return this.model.findByIdAndDelete(id).exec();
  }

  async createIdentitie(jsonData:any){
    try {
      return await this.identitieModel.create(jsonData);
    } catch (error) {
      throw new Error(error?.message||'Data not saved');
    }
  }

  async updateIdentitie(jsonData:any,id){
    try {
      return  await this.identitieModel.findByIdAndUpdate(id,jsonData);
    } catch (error) {
      throw new Error(error?.message||'Data not saved');
    }
  }
}
