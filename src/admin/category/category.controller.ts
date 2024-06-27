import { Body, Controller, Get, Post,Render,Res,Req,UseGuards,Query,Delete,Param,HttpStatus } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { Response, Request } from 'express';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { ListingType } from 'src/schemas/listingtype.schema';

@ApiExcludeController()
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
        const allTypes = await this.categoryService.getAllTypes();

        return {layout:'admin',allTypes}
    }

    @Post('/category/save')
    async saveCategory(@Req() req: Request, @Res() res: Response){
       // return {layout:'admin'}
    }

    @Get('/listing-types')
    @Render('admin/category/listing_type_list')
    async listingTypes(@Query() paginationQuery: PaginationQueryDto, @Query('sortBy') sortBy: string = 'createdAt',@Query('sortOrder') sortOrder: string = 'desc',@Req() req: Request): Promise<{ listingTypes:any, pagination:any,layout:string}>{
        try {
            const {page=1,limit=5} = paginationQuery;
            const listingTypes = await this.categoryService.findAll(paginationQuery,sortBy,sortOrder);
            const pagination = await this.categoryService.getPaginatedUsers(limit, page);;
            return { listingTypes,pagination,layout:'admin'};
        } catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }

        
    }

    @Get('/listing-type/add')
    @Render('admin/category/add_listing_type')
    async addListingType(@Req() req: Request, @Res() res: Response){
        return {layout:'admin'}
    }

    @Post('/listing-type/save')
    async saveListingType(@Req() req: Request, @Res() res: Response){
        try {
            var data = req?.body||{};
            data.status=1;
            const lt = await this.categoryService.create(data);
            req.session.flash = {
                success:'Listing Type add successfully',
            };
            return res.redirect('/admin/listing-types');
        } catch (error) {
            req.session.flash = {
                error: error.message,
            };

            return res.redirect('/admin/listing-type/add');
        }
    }

    @Post('/delete-listing-type/:id')
    async deleteType(@Param('id') id: string,@Req() req: Request, @Res() res: Response) {
        try {
            const deleted = await this.categoryService.deletedById(id);
            if (!deleted) {
                req.session.flash = {
                    error:HttpStatus.NOT_FOUND,
                };
                return res.redirect('/admin/listing-types');
            }
            req.session.flash = {
                success:'Listing Type deleted successfully',
            };
            return res.redirect('/admin/listing-types');
        } catch (error) {
            req.session.flash = {
                error:error.message,
            };
            return res.redirect('/admin/listing-types');
        }
    }

    

}
