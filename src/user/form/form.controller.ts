import { 
    Controller,
    Post, 
    Query,
    Get,
    Param,
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
    @Get('/edit/:id')
    @Render('user/edit_form')
    async editForm(){
        return {layout:'user'}
    }
    @Get('/getForm/:id')
    async getForm(@Param('id') id: string){
        const f = await this.formService.getForm(id);
        return f;
    }

    @Get('/list')
    @Render('user/form_list')
    async formsList(@Query() paginationQuery: PaginationQueryDto,@Req() req: Request) {
        try {
           const {page=1,limit=5} = paginationQuery;
        //   const forms=await this.formService.getAllForms(paginationQuery,sortBy,sortOrder);;
           const pagination = await this.formService.getPaginatedForms(limit, page);
        //   console.log(forms,'all forms');
          return {layout:'user',pagination};
        } catch (error) {
            console.log(error);
            req.session.flash = {
                error: error.message,
            };
        }
    }
    @Get('/list/all')
    async formsListAll(@Query() paginationQuery: PaginationQueryDto, @Query('sortBy') sortBy: string = 'createdAt',@Query('sortOrder') sortOrder: string = 'desc',@Req() req: Request,@Res() res: Response){
        try {
          const {page=1,limit=5} = paginationQuery;
          const forms=await this.formService.getAllForms(paginationQuery,sortBy,sortOrder);;
          const pagination = await this.formService.getPaginatedForms(limit, page);
          console.log(forms,'all forms');
          res.json({status:'success',data:forms,message:'all data',pagination}).status(200);
        } catch (error) {
            console.log(error);
            req.session.flash = {
                error: error.message,
            };
            res.json({status:'success',message:error.message,data:''});
        }
    }

    @Post('/change-status/:id')
    async updateStatus(@Param('id') id: string,@Req() req: Request, @Res() res: Response){
        var data = req?.body||{};
        console.log(data,id);
        try {
            const formData = await this.formService.getForm(id);
            if(formData?.status){
                formData.status = false;
            }else{
                formData.status = true;
            }
            await this.formService.editForm({status:formData.status},id);
            res.json({status:'success',message: 'Form status changed successfully.'});
        }catch (error){
            res.json({status:'error',message: error.message});
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

    @Post('/save-file/')
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

    @Post('/save-form/:id?')
    async saveForm(@Param('id') id: string,@Req() req: Request, @Res() res: Response){
        try {
            var data = req?.body||{};
                if(data.visibility==true){
                    data.visibility='private';
                }else{
                    data.visibility='public';
                }
                data.uid = req.session.user._id||'';
            if(id){
                const f = await this.formService.editForm(data,id);
                res.json({status:'success',message:'Form data successfuly edited.',data:f});
            }else{
                const f = await this.formService.create(data);
                res.json({status:'success',message:'Form data successfuly saved.',data:f});
            }
            console.log(req.session.user,'user');

        } catch (error) {
            res.json({status:'error',message:error.message});
        }
    }

    @Get('/responses/:id')
    @Render('user/form_responses')
    async formResponses(@Param('id') id: string,@Req() req: Request, @Res() res: Response){
        return {layout:'user',id:id};
    }

    @Get('/responses-list/:id')
    async formsResponsesList(@Param('id') id: string,@Query() paginationQuery: PaginationQueryDto, @Query('sortBy') sortBy: string = 'createdAt',@Query('sortOrder') sortOrder: string = 'desc',@Req() req: Request,@Res() res: Response){
        try {
          const {page=1,limit=5} = paginationQuery;
          const forms=await this.formService.getAllResponses(paginationQuery,sortBy,sortOrder,id);;
          const pagination = await this.formService.getPaginatedResponses(limit, page,id);
          console.log(forms,'all forms');
          res.json({status:'success',data:forms,message:'all data',pagination}).status(200);
        } catch (error) {
            console.log(error);
            req.session.flash = {
                error: error.message,
            };
            res.json({status:'success',message:error.message,data:''});
        }
    }
}
