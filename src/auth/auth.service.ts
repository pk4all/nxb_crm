import { Injectable,UnauthorizedException,BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
//import { validate } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private tokenBlacklist: Set<string> = new Set();
    constructor(
      @InjectModel(User.name) private userModel: Model<User>,
      private jwtService: JwtService
    ) {
      
    }
    async create(jsonData: any) {
        const createUserDto = plainToInstance(CreateUserDto, jsonData);
        const createdCat = new this.userModel(createUserDto);
        return await createdCat.save();
        //return await this.userModel.create(createUserDto);
      }
    
      async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
      }

      async findOne(email: string): Promise<User | undefined> {
        return this.userModel.findOne({email}).select('-password').select('-__v').exec();
      }
      async findLogin(email: string): Promise<User | undefined> {
        return this.userModel.findOne({email});
      }

      async signIn(username: string, pass: string) {
        const user = await this.findLogin(username);

        const isMatch = await bcrypt.compare(pass, user?.password);
        if (!isMatch) {
          throw new BadRequestException('User name or password is not valid', { cause: new Error(), description: 'Invalid Credentials' });
        }
        const payload = {id:user?.id, email: user?.email, name: user?.name };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      }

      async validateUser(username: string, pass: string){
        const user = await this.findOne(username);
        const isMatch = await bcrypt.compare(pass, user?.password);
        if (!isMatch) {
          throw new BadRequestException('User name or password is not valid', { cause: new Error(), description: 'Invalid Credentials' });
        }
        const { password, ...result } = user;
        return result;
        // const payload = { email: user.email, sub: user.name };
        // return {
        //   access_token: await this.jwtService.signAsync(payload),
        // };
      }

      blacklistToken(token: string): void {
        this.tokenBlacklist.add(token);
      }
    
      isTokenBlacklisted(token: string): boolean {
        return this.tokenBlacklist.has(token);
      }
      
}
