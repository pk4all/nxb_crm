import { Body,Controller, Get, Post,UseGuards,Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../schemas/user.schema';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';
import {LocalAuthGuard} from './local-auth.guard'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import {JwtAuthGuard} from './auth.guard';
import { UserDto } from 'src/dto/user.dto';
//import { JwtAuthGuard } from './jwt-auth.guard';
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    //@UseGuards(AuthGuard('local'))
    //@UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Body() createUserDto:CreateUserDto){
        //return createUserDto
        try {
            const u = await this.authService.signIn(createUserDto.email,createUserDto.password);
            return u;
        } catch (error) {
            return {
                status:'error',
                message:error.message
            };
        }
    }
    
    @Get('/profile')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Request() req){
        try {
            const u = await this.authService.findOne(req?.user?.email);
            const UserData = plainToInstance(UserDto, u);
            return {
                status:'success',
                data:UserData,
                message:'User Profile Date'
            }
        } catch (error) {
            return {
                status:'error',
                message:error.message
            };
        }
        return req.user;
    }
    

}
