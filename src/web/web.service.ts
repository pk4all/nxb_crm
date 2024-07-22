import { Injectable,BadRequestException,ConflictException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/schemas/category.schema';
import { Form } from 'src/schemas/form.schema';

@Injectable()
export class WebService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        @InjectModel(Form.name) private formModel: Model<Form>
    ) {}
    async getForm(id){
        const d =  await this.formModel
        .findById(id)
        .populate('category')
        .lean()
        .exec();
        return d;
  
      }
}
