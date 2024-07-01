import { 
    Body, 
    Controller, 
    Get, 
    Post,
    Render,
    Res,
    Req,
    UseGuards,
    Query,
    Param,
    HttpStatus,
    UploadedFile,
    UseInterceptors
  } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { Response, Request } from 'express';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import sharp from 'sharp';
@ApiExcludeController()
@Controller('admin')
@UseGuards(SessionGuard)
export class CategoryController {

    constructor(private readonly categoryService: CategoryService) {}

    @Get('/categories')
    @Render('admin/category/categories_list')
    async categories(@Query() paginationQuery: PaginationQueryDto, @Query('sortBy') sortBy: string = 'createdAt',@Query('sortOrder') sortOrder: string = 'desc',@Req() req: Request): Promise<{ categories:any, pagination:any,layout:string}>{
        try {
            const {page=1,limit=5} = paginationQuery;
            const categories=await this.categoryService.findAllCates(paginationQuery,sortBy,sortOrder);;
            const pagination = await this.categoryService.getPaginatedCategories(limit, page);
            console.log(pagination);
            return {layout:'admin',pagination,categories};

        } catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
    }

    @Get('/category/add')
    @Render('admin/category/add_category')
    async addCategory(@Req() req: Request, @Res() res: Response){
        const types = await this.categoryService.getAllTypes();
        const allTypes = Object.keys(types).map(key => ({ key, value: types[key] }));
        const allCats = await this.categoryService.getAllcats();
        return {layout:'admin',allTypes,allCats};
    }
    @Get('/category/edit/:id')
    @Render('admin/category/edit_category')
    async editCategory(@Param('id') id: string,@Req() req: Request, @Res() res: Response){
        const categoryData = await this.categoryService.getCat(id);
        const types = await this.categoryService.getAllTypes();
        const allTypes = Object.keys(types).map(key => ({ key, value: types[key] }));
        const allCats = await this.categoryService.getAllcats();
    //     const cfd = categoryData['customFields'];
    //     const jsonItems = categoryData['customFields'].map(item => item);
    //    console.log(jsonItems);
        return {layout:'admin',allTypes,allCats,categoryData:categoryData,id};
    }

    @Get('/category/get-custom-fields/:id')
    async getCategoryCustomFields(@Param('id') id: string,@Req() req: Request, @Res() res: Response){
        const categoryData = await this.categoryService.getCat(id);
        const customFields = categoryData['customFields'];
        res.json(customFields);
    }

    @Post('/category/save')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
          destination: './public/uploads/category',
          filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
            const extension: string = path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`);
          },
        }),
      }))
    async saveCategory(@Req() req: Request, @Res() res: Response,@UploadedFile() file){
        try {
            var data = req?.body||{};
            if(file){
                const watermarkPath = 'public/watermark.png';
                const outputFilePath = 'public/uploads/category/adolaa-'+`${file.filename}`;
                await sharp(file.path)
                    .composite([{ input: watermarkPath, gravity: 'southeast' }])
                    .toFile(outputFilePath);
                fs.unlinkSync(file.path);
                data.image='adolaa-'+file?.filename;
            }
            if(data?.customFields){
               var cfd = JSON.parse(data?.customFields);
                data.customFields=cfd.map(elm=>{
                    elm.fieldKey=elm?.fieldName.toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
                    return elm;
                });
            }
            if(data?.parentId){
                const c = await this.categoryService.getCat(data?.parentId);
                data.parentName=c?.name;
            }else{
                data.parentId=null;
            }
            if(data?.typeId){
                const c = await this.categoryService.getAllTypes();
                data.typeName=c[data?.typeId];
            }else{
                data.parentId=null;
            }
            if(data.status=='on'){
                data.status=true;
            }else{
                data.status=false;
            }
            const cat = await this.categoryService.createCategory(data);
            res.json({status:'success',message: 'Category successfully created.',data:cat});
        } catch (error) {
            res.json({status:'error',message: error.message});
        }
    }

    @Post('/category/saveEdit/:id')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
          destination: './public/uploads/category',
          filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
            const extension: string = path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`);
          },
        }),
      }))
    async saveEditCategory(@Param('id') id: string,@Req() req: Request, @Res() res: Response,@UploadedFile() file){
        try {
            //const categoryData = await this.categoryService.getCat(id);
            var data = req?.body||{};
            if(file){
                const watermarkPath = 'public/watermark.png';
                const outputFilePath = 'public/uploads/category/adolaa-'+`${file.filename}`;
                await sharp(file.path)
                    .composite([{ input: watermarkPath, gravity: 'southeast' }])
                    .toFile(outputFilePath);
                fs.unlinkSync(file.path);
                data.image='adolaa-'+file?.filename;
            }
            if(data?.customFields){
               var cfd = JSON.parse(data?.customFields);
                data.customFields=cfd.map(elm=>{
                    elm.fieldKey=elm?.fieldName.toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
                    return elm;
                });
            }
            if(data?.parentId){
                const c = await this.categoryService.getCat(data?.parentId);
                data.parentName=c?.name;
            }else{
                data.parentId=null;
            }
            if(data?.typeId){
                const c = await this.categoryService.getAllTypes();
                data.typeName=c[data?.typeId];
            }else{
                data.parentId=null;
            }
            if(data.status=='on'){
                data.status=true;
            }else{
                data.status=false;
            }
            const cat = await this.categoryService.editCategory(data,id);
            res.json({status:'success',message: 'Category successfully edited.',data:cat});
        } catch (error) {
            res.json({status:'error',message: error.message});
        }
    }
    @Post('/category/update-status/:id')
    async updateStatus(@Param('id') id: string,@Req() req: Request, @Res() res: Response){
        var data = req?.body||{};
        console.log(data,id);
        try {
            const categoryData = await this.categoryService.getCat(id);
            if(categoryData?.status){
                categoryData.status = false;
            }else{
                categoryData.status = true;
            }
            await this.categoryService.editCategory({status:categoryData.status},id);
            res.json({status:'success',message: 'Category status changed successfully.'});
        }catch (error){
            res.json({status:'error',message: error.message});
        }
    }


    @Post('/delete-category/:id')
    async deleteCategory(@Param('id') id: string,@Req() req: Request, @Res() res: Response) {
        try {
            const deleted = await this.categoryService.deletedCategoryById(id);
            if (!deleted) {
                req.session.flash = {
                    error:HttpStatus.NOT_FOUND,
                };
                return res.redirect('/admin/categories');
            }
            req.session.flash = {
                success:'Category successfully deleted',
            };
            return res.redirect('/admin/categories');
        } catch (error) {
            req.session.flash = {
                error:error.message,
            };
            return res.redirect('/admin/categories');
        }
    }

    @Get('/listing-types')
    @Render('admin/category/listing_type_list')
    async listingTypes(@Query() paginationQuery: PaginationQueryDto, @Query('sortBy') sortBy: string = 'createdAt',@Query('sortOrder') sortOrder: string = 'desc',@Req() req: Request): Promise<{ listingTypes:any, pagination:any,layout:string}>{
        try {
            const {page=1,limit=5} = paginationQuery;
            const listingTypes = await this.categoryService.findAll(paginationQuery,sortBy,sortOrder);
            const pagination = await this.categoryService.getPaginatedListingType(limit, page);
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
