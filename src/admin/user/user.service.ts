import { Injectable,BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../../schemas/admin.schema';
import { CreateAdminDto } from '../../dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { PermissionSchema,Permission } from 'src/schemas/permission.schema';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
@Injectable()
export class UserService {
    constructor(
        @InjectModel(Admin.name) private adminModel: Model<Admin>,
        @InjectModel(Permission.name) private permissionModel: Model<Permission>,
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

    async saveAllRoutes(jsonData:any) {
      jsonData.forEach( async (element) => {
        const exist = await this.permissionModel.findOne({name:element?.name}).lean().exec();
        console.log(exist,'exist data');
        if(exist){
          const c = await this.permissionModel.findByIdAndUpdate(exist._id,element);
          console.log(c,'update data');
        }else{
          const c =  await this.permissionModel.create(element);
          console.log(c,'save data');
        }
      }); 
    }

    async getAllPermissions(paginationQuery: PaginationQueryDto,sortBy: string, sortOrder: string): Promise<Permission[]>{
      const { limit, search,page=1} = paginationQuery;
      const sortCriteria:any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
      const query = search ? { title: new RegExp(search, 'i') } : {};
      const l = limit||5;
      const ofs = ((page-1)*l);
      return this.permissionModel
        .find(query)
        .skip(ofs)
        .limit(l)
        .sort(sortCriteria)
        .lean()
        .exec();
    }

  async getPaginatedPermission(limit: number, page: number): Promise<any> {
      const total = await this.permissionModel.countDocuments().exec();
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
