import { Controller,Post, Body} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../schemas/user.schema';
import { UserService } from './user.service';
@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/register')
    async registerUser(@Body() createUserDto:CreateUserDto){
        try {
            const u = await this.userService.create(createUserDto);
            return {
                status:'success',
                data:u,
                message:'User successfuly created'
            };
        } catch (error) {
            return {
                status:'error',
                message:error.message
            };
        }
    }
}
