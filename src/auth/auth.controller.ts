import { Body,Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../schemas/user.schema';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    async login(@Body() createUserDto:CreateUserDto){
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
    

}
