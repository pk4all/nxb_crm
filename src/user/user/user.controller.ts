import { Controller,Post, Body,Get,Render} from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../schemas/user.schema';
import { UserService } from './user.service';
import { createResponse } from '../../common/utils/response.util';
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {

    }

    @Post('/register')
    async registerUser(@Body() createUserDto:CreateUserDto){
        try {
            const u = await this.userService.create(createUserDto);
            return createResponse(200,u,'User successfuly created ','success');
        } catch (error) {
            return createResponse(error.statusCode,'',error.message,'error');
        }
    }


    @Get('/dashboard')
    @Render('user/dashboard')
    async dashboard(){
        return {layout:'user'}
    }

    

    @Get('/new-form')
    @Render('user/new_form')
    async newForm(){
        return {layout:'user'}
    }

    @Get('/form-categories')
    async formCategories(){
        try {
            const allCats = await this.userService.getAllCategories();
            return {data:allCats}
        } catch (error) {
            return {type:'error',message:error.message}
        }
    }

    @Get('/form-fields')
    async formFields(){
        try {
            const allDatas = await this.userService.getAllFields();
            return {data:allDatas}
        } catch (error) {
            return {type:'error',message:error.message}
        }
    }

}
