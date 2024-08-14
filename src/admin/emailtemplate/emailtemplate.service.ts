import { Injectable,ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { EmailTemplate } from 'src/schemas/emailtemplate.schema';
import { Identity } from 'src/schemas/identity.schema';
import { Contact } from 'src/schemas/contact.schema';

@Injectable()
export class EmailTemplateService {
  constructor(
    @InjectModel(EmailTemplate.name) private model: Model<EmailTemplate>,
    @InjectModel(Identity.name) private identityModel: Model<Identity>,
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
  ){}
  async create(jsonData:any) {
    try {
      //console.log(jsonData,'tmpl data');
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
    return await this.model
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
      console.log(jsonData,'tmpl data');
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

  async createIdentity(jsonData:any){
    try {
      return await this.identityModel.create(jsonData);
    } catch (error) {
      throw new Error(error?.message||'Data not saved');
    }
  }

  async updateIdentity(jsonData:any,id){
    try {
      return  await this.identityModel.findByIdAndUpdate(id,jsonData);
    } catch (error) {
      throw new Error(error?.message||'Data not saved');
    }
  }

  async updateOrCreateIdentity(data,email){
    try {
      return  await this.identityModel.updateOne({identityName:email}, data, { upsert: true });
    } catch (error) {
      throw new Error(error?.message||'Data not saved');
    }
  }

  async getIdentitiyData(email){
    try {
      //return await this.model.findOne({identityName:email}).lean().exec();
      return await this.identityModel.findOne({identityName:email}).lean().exec();
    } catch (error) {
      throw new ConflictException(error?.message||'No Data');
    }
  }

  async getIdentitiy(id){
    try {
      return await this.identityModel.findById(id).lean().exec();
    } catch (error) {
      throw new ConflictException(error?.message||'No Data');
    }
  }

  async getIdentitiesData(){
    try {
      const datas = await this.identityModel.find({}).lean().exec();
      return datas;

    } catch (error) {
      throw new Error(error?.message||'No Data');
    }
  }

  async createContact(jsonData){
    try {
      return await this.contactModel.create(jsonData);
    } catch (error) {
      throw new Error(error?.message||'Data not saved');
    }
  }

  async getContactsData(){
    try {
      //const datas = await this.contactModel.find({}).lean().exec();
      const results = await this.contactModel.aggregate([
        {
          $project: {
            name: 1,
            status:1,
            contactsCount: { $size: '$contacts' },
          },
        },
      ]).exec();
      //console.log(results,'results');
      return results;
    } catch (error) {
      throw new Error(error?.message||'No Data');
    }
  }
}
