import { Injectable,BadRequestException,ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../../schemas/admin.schema';
import { CreateAdminDto } from '../../dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { PermissionSchema,Permission } from 'src/schemas/permission.schema';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { Role } from 'src/schemas/role.schema';
@Injectable()
export class UserService {
    constructor(
        @InjectModel(Admin.name) private adminModel: Model<Admin>,
        @InjectModel(Permission.name) private permissionModel: Model<Permission>,
        @InjectModel(Role.name) private roleModel: Model<Role>,
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
        const exist = await this.permissionModel.findOne({path:element?.path}).lean().exec();
        console.log(exist,'exist data');
        if(exist){
          const c = await this.permissionModel.findByIdAndUpdate(exist._id,{path:element?.path,method:element?.method});
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

  async updatePermission(jsonData:any,id){
    try {
      return await this.permissionModel.findByIdAndUpdate(id,jsonData);
    } catch (error) {
      throw new ConflictException(error?.message||'Data not saved');
    }
  }

  async getPermission(id){
    try {
      return await this.permissionModel.findById(id).lean().exec();
    } catch (error) {
      throw new ConflictException(error?.message||'No Data');
    }
  }

  async getAllUserPermissions(){
    try {
      const sortCriteria:any = { ['name']: 1 };
      return await this.permissionModel.find({status:true}).sort(sortCriteria).lean().exec();
    } catch (error) {
      throw new ConflictException(error?.message||'No Data');
    }
  }

  async getAllSelectedPermissions(ids){
    try {
      return await this.permissionModel.find({_id:{ $in: ids },status:true}).lean().exec();
    } catch (error) {
      throw new ConflictException(error?.message||'No Data');
    }
  }

  async saveRole(jsonData:any){
      try {
        return await this.roleModel.create(jsonData);
      } catch (error) {
        throw new ConflictException(error?.message||'Data not saved');
      }
  }

  async getAllRoles(paginationQuery: PaginationQueryDto,sortBy: string, sortOrder: string): Promise<Role[]>{
    const { limit, search,page=1} = paginationQuery;
    const sortCriteria:any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const query = search ? { title: new RegExp(search, 'i') } : {};
    const l = limit||5;
    const ofs = ((page-1)*l);
    return this.roleModel.find(query)
      .skip(ofs)
      .limit(l)
      .sort(sortCriteria)
      .lean()
      .exec();
  }

  async getPaginatedRoles(limit: number, page: number): Promise<any> {
      const total = await this.roleModel.countDocuments().exec();
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

  async getRole(id){
    try {
      return await this.roleModel.findById(id).lean().exec();
    } catch (error) {
      throw new ConflictException(error?.message||'No Data');
    }
  }

  async updateRole(jsonData:any,id){
    try {
      return await this.roleModel.findByIdAndUpdate(id,jsonData);
    } catch (error) {
      throw new ConflictException(error?.message||'Data not saved');
    }
  }

  async getRoles(){
    try {
      return await this.roleModel.find({},'_id name').lean().exec();
    } catch (error) {
      throw new ConflictException(error?.message||'No Data');
    }
  }

  async createUser(jsonData:any){
    try {
      return await this.adminModel.create(jsonData);
    } catch (error) {
      throw new ConflictException(error?.message||'Data not saved');
    }
  }

  async getAllUsers(paginationQuery: PaginationQueryDto,sortBy: string, sortOrder: string): Promise<Admin[]>{
    const { limit, search,page=1} = paginationQuery;
    const sortCriteria:any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const query = search ? { title: new RegExp(search, 'i') } : {};
    const l = limit||5;
    const ofs = ((page-1)*l);
    return this.adminModel.find(query)
      .skip(ofs)
      .limit(l)
      .sort(sortCriteria)
      .lean()
      .exec();
  }

  async getPaginatedUsers(limit: number, page: number): Promise<any> {
      const total = await this.adminModel.countDocuments().exec();
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

  async getUser(id){
    try {
      return await this.adminModel.findById(id).lean().exec();
    } catch (error) {
      throw new ConflictException(error?.message||'No Data');
    }
  }

  async updateUser(jsonData:any,id){
    try {
      return await this.adminModel.findByIdAndUpdate(id,jsonData);
    } catch (error) {
      throw new ConflictException(error?.message||'Data not updated');
    }
  }
  
}
