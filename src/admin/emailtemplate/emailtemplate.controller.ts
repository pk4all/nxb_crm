import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Render,Query,
  HttpStatus,
  Res,
  Req,
  } from '@nestjs/common';
import { EmailTemplateService } from './emailtemplate.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import {createTemplate,updateTemplate,deleteTemplate,listIdentities,identitiesAttrs} from 'src/common/utils/ses.utility';


@UseGuards(SessionGuard)
@Controller('admin')
export class EmailTemplateController {
  constructor(private readonly service: EmailTemplateService) {}

    @Get('/email-templates')
    @Render('admin/emailtemplate/templates')
    async allTemplates(@Query() paginationQuery: PaginationQueryDto, @Query('sortBy') sortBy: string = 'createdAt',@Query('sortOrder') sortOrder: string = 'desc',@Req() req: Request): Promise<{ templates:any, pagination:any,layout:string}> {
      try {
        // await deleteTemplate('listing-type-3');
        const {page=1,limit=5} = paginationQuery;
        const templates=await this.service.getAllDatas(paginationQuery,sortBy,sortOrder);;
        const pagination = await this.service.getPaginated(limit, page);
        return {layout:'admin',pagination,templates};

      } catch (error) {
          req.session.flash = {
              error: error.message,
          };
      }
    }

  @Get('/email-template/add')
  @Render('admin/emailtemplate/add_template')
  add() {
    return {layout:'admin'};
  }


  @Get('/email-template/identities')
  @Render('admin/emailtemplate/identities')
  identitie() {
    return {layout:'admin'};
  }

  @Get('/email-template/edit/:id')
  @Render('admin/emailtemplate/edit_template')
  async edit(@Param('id') id: string,@Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.service.getData(id);
      return {layout:'admin',data,id};
    } catch (error) {
      req.session.flash = {
          error: error.message,
      };
    }
  }

  @Post('/email-template/create')
  async create(@Req() req: Request, @Res() res: Response) {
    try {
      var reqdata = req?.body||{};
      reqdata.templateSlug= reqdata.templateName
       .toLowerCase()
       .trim()
       .replace(/\s+/g, '-')
       .replace(/[^\w\-]+/g, '')
       .replace(/\-\-+/g, '-');
      if(reqdata.type=='email-template'){
        const ses = await createTemplate(reqdata);
        reqdata.resourceId = ses.$metadata.requestId;
      }
      
      //return ses.$metadata.requestId;
      if(reqdata.status=='on'){
        reqdata.status=true;
      }else{
        reqdata.status=false;
      }
      const data = await this.service.create(reqdata);
      res.json({status:'success',message: 'Template successfully created.',data:data});
    } catch (error) {
      console.log(error,'erore');
        res.json({status:'error',message: error.message});
    }
  }

  @Post('/email-template/update/:id')
  async update(@Body() body:any ,@Param('id') id: string,@Req() req: Request, @Res() res: Response) {
    try {
      var reqdata = req?.body||{};
      reqdata.templateSlug= reqdata.templateName
       .toLowerCase()
       .trim()
       .replace(/\s+/g, '-')
       .replace(/[^\w\-]+/g, '')
       .replace(/\-\-+/g, '-');
      if(reqdata.type=='email-template'){
        const ses = await updateTemplate(reqdata);
        reqdata.resourceId = ses.$metadata.requestId;
      }
      if(reqdata.status=='on'){
        reqdata.status=true;
      }else{
        reqdata.status=false;
      }
      const page = await this.service.update(reqdata,id);
      res.json({status:'success',message: 'Template successfully Updated.',data:page});
    } catch (error) {
        res.json({status:'error',message: error.message});
    }
  }

  @UseGuards(SessionGuard)
    @Post('/email-template/delete/:id')
    async deleteType( @Param('id') id: string,@Req() req: Request, @Res() res: Response) {
        try {
          const tmpl = await this.service.getData(id);
            await deleteTemplate(tmpl?.templateSlug);
            const deleted = await this.service.deletedById(id);
            if (!deleted) {
                req.session.flash = {
                    error:HttpStatus.NOT_FOUND,
                };
                return res.redirect('/admin/email-templates');
            }

            req.session.flash = {
                success:'Template deleted successfully',
            };
            return res.redirect('/admin/email-templates');
        } catch (error) {
            req.session.flash = {
                error:error.message,
            };
            return res.redirect('/admin/email-templates');
        }
    }

  @Post('/email-template/change-status/:id')
    async updateStatus(@Param('id') id: string,@Req() req: Request, @Res() res: Response){
        var data = req?.body||{};
        try {
            const pageData = await this.service.getData(id);
            if(pageData?.status){
              pageData.status = false;
            }else{
              pageData.status = true;
            }
            await this.service.update({status:pageData.status},id);
            res.json({status:'success',message: 'Template status changed successfully.'});
        }catch (error){
            res.json({status:'error',message: error.message});
        }
    }
  @Post('/template/sync-identities')
  async syncIdentities(@Req() req: Request, @Res() res: Response){
      try {
        const identities = await listIdentities();
        const allIdentities = identities?.Identities||[];
        const allData = await identitiesAttrs(allIdentities);
        res.json({status:'success',message: 'Sync successfully.',data:allData});
      } catch (error) {
        res.json({status:'error',message: error.message});
      }
  }
    
}
