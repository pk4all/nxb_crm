import { Injectable,OnModuleInit,ConflictException,UnauthorizedException,BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import { CreateUserDto } from '../../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
      ) {}

    async create(jsonData: any) {
        try {
            return await this.userModel.create(jsonData);
          } catch (error) {
            throw new BadRequestException(error?.message||'Data not saved');
          }
    }

    async findLogin(email: string): Promise<User | undefined> {
      return this.userModel.findOne({email}).lean();
    }

    async signIn(username: string, pass: string) {
      try {
        const user = await this.findLogin(username);
      
        const isMatch = await bcrypt.compare(pass, user?.password);
        if (!isMatch) {
          //return {message:'Password is not valid',status:'error'};
          throw new BadRequestException('User name or password is not valid', { cause: new Error(), description: 'Invalid Credentials' });
        }
        return {user:user,status:'success'};
      } catch (error) {
        //return {message:'User name or password is not valid',status:'error'};
        throw new BadRequestException(error.message, { cause: new Error(), description: 'Invalid Credentials, please retry.' });
      }
    }
    
}
