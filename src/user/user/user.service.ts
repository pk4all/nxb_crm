import { Injectable,OnModuleInit } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import { CreateUserDto } from '../../dto/create-user.dto';
import { Category } from 'src/schemas/category.schema';
import { FieldType } from 'src/schemas/fieldtype.schema';
@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        @InjectModel(FieldType.name) private fieldTypeModel: Model<FieldType>
      ) {
        
      }

    async create(jsonData: any) {
        const createUserDto = plainToInstance(CreateUserDto, jsonData);
        const createdUser = new this.userModel(createUserDto);
        return await createdUser.save();
    }


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

    
}
