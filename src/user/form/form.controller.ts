import { 
    Controller,
    Post, 
    Query,
    Get,
    Render,
    UseGuards,
    UploadedFile,
    UseInterceptors,
    Req,
    Res,
    BadRequestException
} from '@nestjs/common';
import { FormService } from './form.service';
import { UserSessionGuard } from 'src/gaurds/user.session.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { Response, Request } from 'express';

@UseGuards(UserSessionGuard)
@Controller('form')
export class FormController {
    constructor(private readonly formService: FormService) {}

    @Get('/new-form')
    @Render('user/new_form')
    async newForm(){
        return {layout:'user'}
    }
    @Get('/list')
    @Render('user/form_list')
    async formsList(@Query() paginationQuery: PaginationQueryDto, @Query('sortBy') sortBy: string = 'createdAt',@Query('sortOrder') sortOrder: string = 'desc',@Req() req: Request): Promise<{ forms:any, pagination:any,layout:string}> {
        try {
          const {page=1,limit=5} = paginationQuery;
          const forms=await this.formService.getAllForms(paginationQuery,sortBy,sortOrder);;
          const pagination = await this.formService.getPaginatedForms(limit, page);
          return {layout:'user',pagination,forms};
  
        } catch (error) {
            req.session.flash = {
                error: error.message,
            };
        }
    }
    
    @Get('/form-categories')
    async formCategories(){
        try {
            const allCats = await this.formService.getAllCategories();
            return {type:'success',data:allCats}
        } catch (error) {
            return {type:'error',message:error.message}
        }
    }

    @Get('/form-fields')
    async formFields(){
        try {
            const allDatas = await this.formService.getAllFields();
            return {data:allDatas}
        } catch (error) {
            return {type:'error',message:error.message}
        }
    }

    @Post('/save-file')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
          destination: './public/uploads/form/images',
          filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
            const extension: string = path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`);
          },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
              return cb(new BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
          },
      }))
    async saveImage(@Req() req: Request, @Res() res: Response,@UploadedFile() file){
        if(file){
            res.json({status:'success',file:file.filename,data:file});
        }else{
            res.json({status:'error',message:'no file'});
        }
    }

    @Post('/save-form')
    async saveForm(@Req() req: Request, @Res() res: Response){
        try {
            var data = req?.body||{};
            if(data.visibility==true){
                data.visibility='private';
            }else{
                data.visibility='public';
            }
            const f = await this.formService.create(data);
            res.json({status:'success',message:'Form data successfuly saved.',data:f});
        } catch (error) {
            res.json({status:'error',message:error.message});
        }
    }
}
