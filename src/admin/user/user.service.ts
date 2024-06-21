import { Injectable,BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../../schemas/admin.schema';
import { CreateAdminDto } from '../../dto/create-admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(Admin.name) private adminModel: Model<Admin>,
      ){}
    async findLogin(email: string): Promise<Admin | undefined> {
        return this.adminModel.findOne({email}).exec();
      }

    async signIn(username: string, pass: string) {
      try {
        const user = await this.findLogin(username);
       //return user;
        if(user){
            const isMatch = await bcrypt.compare(pass, user?.password);
            //return isMatch;
            if (!isMatch) {
              throw new BadRequestException('User name or password is not valid', { cause: new Error(), description: 'Invalid Credentials or worng password.' });
            }
            return {user:user,status:'success'};
        }
        return {message:'User name or password is not valid',status:'error'};
        throw new BadRequestException('User name or password is not valid', { cause: new Error(), description: 'Invalid Credentials, please retry.' });
      } catch (error) {
        return {message:'User name or password is not valid',status:'error'};
        throw new BadRequestException(error.message, { cause: new Error(), description: 'Invalid Credentials, please retry.' });
      } 
    }
}
