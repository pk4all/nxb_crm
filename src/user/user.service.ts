import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
      ) {
        
      }

    async create(jsonData: any) {
        const createUserDto = plainToInstance(CreateUserDto, jsonData);
        const createdCat = new this.userModel(createUserDto);
        return await createdCat.save();
        //return await this.userModel.create(createUserDto);
      }
}
