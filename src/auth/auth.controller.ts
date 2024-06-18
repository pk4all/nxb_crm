import { Body,Controller, Get, Post,UseGuards,Res,Req } from '@nestjs/common';
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
import { Request ,Response} from 'express';
import { createResponse } from '../common/utils/response.util';
//import { JwtAuthGuard } from './jwt-auth.guard';
@Controller('api/')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    //@UseGuards(AuthGuard('local'))
    //@UseGuards(LocalAuthGuard)
    @Post('/auth/login')
    async login(@Body() createUserDto:CreateUserDto){
        try {
            const u = await this.authService.signIn(createUserDto?.email,createUserDto?.password);
            return createResponse(200,u,'Login successfully ','success');
        } catch (error) {
            return createResponse(error.statusCode,'',error.message,'error');
        }
    }

    @Post('/auth/logout')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    async logut(@Req() req: Request, @Res() res: Response): Promise<void> {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (token) {
            this.authService.blacklistToken(token);
            }
            res.clearCookie('access_token'); // If you are using cookies for token storage
            res.send({statusCode:200,status:'sucess', message: 'Logged out successfully' });
        } catch (error) {
            res.send({statusCode:200,status:'error', message: error?.message });
        }
        
    }
    @Get('/user/profile')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req: Request){
        //return req?.user['email'];
        try {
            const u = await this.authService.findOne(req?.user['email']);
            return createResponse(200,u,'User Profile Date ','success');
        } catch (error) {
            return createResponse(error.statusCode,'',error.message,'error');
        }
    }
    

}
