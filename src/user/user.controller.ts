import { Controller,Post, Body,Get} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../schemas/user.schema';
import { UserService } from './user.service';
import { createResponse } from '../common/utils/response.util';
@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/register')
    async registerUser(@Body() createUserDto:CreateUserDto){
        try {
            const u = await this.userService.create(createUserDto);
            return createResponse(200,u,'User successfuly created ','success');
        } catch (error) {
            return createResponse(error.statusCode,'',error.message,'error');
        }
    }

    @Get('/ads-list')
    async userAdsList(){

    }

}
