import { Body, Controller, Get, Post,Render,Res,Req,UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { Response, Request } from 'express';

@Controller('admin')
@UseGuards(SessionGuard)
export class CategoryController {

    constructor(private readonly categoryService: CategoryService) {}

    @Get('/categories')
    @Render('admin/category/categories_list')
    async categories(@Req() req: Request, @Res() res: Response){
        return {layout:'admin'}
    }

    @Get('/category/add')
    @Render('admin/category/add_category')
    async addCategory(@Req() req: Request, @Res() res: Response){

        return {layout:'admin'}
    }

    @Post('/category/save')
    async saveCategory(@Req() req: Request, @Res() res: Response){
       // return {layout:'admin'}
    }

    @Get('/listing-types')
    @Render('admin/category/listing_type_list')
    async listingTypes(@Req() req: Request, @Res() res: Response){

        return {layout:'admin'}
    }

    @Get('/listing-type/add')
    @Render('admin/category/add_listing_type')
    async addListingType(@Req() req: Request, @Res() res: Response){

        return {layout:'admin'}
    }

    @Post('/listing-type/save')
    async saveListingType(@Req() req: Request, @Res() res: Response){
       // return {layout:'admin'}
    }



}
