import { Injectable,BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/schemas/category.schema';
import { FieldType } from 'src/schemas/fieldtype.schema';
import { Form } from 'src/schemas/form.schema';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
@Injectable()
export class FormService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        @InjectModel(FieldType.name) private fieldTypeModel: Model<FieldType>,
        @InjectModel(Form.name) private formModel: Model<Form>
    ) {}

    async getAllCategories(){
        const sortCriteria:any = { ['name']: 1 };
        return this.categoryModel
          .find({status:true},'name _id')
          .sort(sortCriteria)
          .lean()
          .exec();
    }
    async getAllFields(){
        const sortCriteria:any ={};
        return this.fieldTypeModel
          .find({status:true},'name type')
          .sort(sortCriteria)
          .lean()
          .exec();
        
    }

    async create(jsonData){
        try {
            return await this.formModel.create(jsonData);
          } catch (error) {
            throw new BadRequestException(error?.message||'Data not saved');
          }
            
    }

    async getAllForms(paginationQuery: PaginationQueryDto,sortBy: string, sortOrder: string): Promise<Form[]>{
      const { limit, search,page=1} = paginationQuery;
      const sortCriteria:any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
      const query = search ? { title: new RegExp(search, 'i') } : {};
      const l = limit||5;
      const ofs = ((page-1)*l);
      return this.formModel
        .find(query)
        .skip(ofs)
        .limit(l)
        .sort(sortCriteria)
        .lean()
        .exec();
    }
  
    async getPaginatedForms(limit: number, page: number): Promise<any> {
        const total = await this.formModel.countDocuments().exec();
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
}
