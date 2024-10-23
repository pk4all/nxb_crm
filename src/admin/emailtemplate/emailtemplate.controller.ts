import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Render,Query,
  HttpStatus,
  Res,
  Req,
  UploadedFile,
  UseInterceptors
  } from '@nestjs/common';
import { EmailTemplateService } from './emailtemplate.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import {createTemplate,updateTemplate,deleteTemplate,listIdentities,identitiesAttrs,sendVerificationEmail} from 'src/common/utils/ses.utility';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as XLSX from 'xlsx';

@UseGuards(SessionGuard)
@Controller('admin')
export class EmailTemplateController {
  constructor(private readonly service: EmailTemplateService) {}

    @Get('/templates')
    @Render('admin/template/templates')
    async allTemplates(@Query() paginationQuery: PaginationQueryDto, @Query('sortBy') sortBy: string = 'createdAt',@Query('sortOrder') sortOrder: string = 'desc',@Req() req: Request){
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
          return {layout:'admin'};
      }
    }

  @Get('/template/add')
  @Render('admin/template/add_template')
  add() {
    var synt='Name=>{{name}}, Email=>{{email}}, Phone=>{{phone}}, Address=>{{address}}'
    return {layout:'admin',synt:synt};
  }


  @Get('/email-template/identities')
  @Render('admin/template/identities')
  async identitie(@Req() req: Request) {
    try {
      const datas = await this.service.getIdentitiesData();
     // console.log(datas,'email data');
      return {layout:'admin',datas};
    } catch (error) {
      req.session.flash = {
        error: error.message,
    };
    return {layout:'admin'};
    }
    
  }

  @Get('/template/edit/:id')
  @Render('admin/template/edit_template')
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

  @Post('/template/create')
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
      //console.log(error,'erore');
      res.json({status:'error',message: error.message});
    }
  }

  @Post('/template/update/:id')
  async update(@Body() body:any ,@Param('id') id: string,@Req() req: Request, @Res() res: Response) {
    try {
      var reqdata = req?.body||{};
      var getTmpl = await this.service.getData(id);
      reqdata.templateSlug= getTmpl?.templateSlug;
      //return reqdata;
     // console.log(reqdata,'reqdata');
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
  @Post('/template/delete/:id')
  async deleteType( @Param('id') id: string,@Req() req: Request, @Res() res: Response) {
    try {
      const tmpl = await this.service.getData(id);
        await deleteTemplate(tmpl?.templateSlug);
        const deleted = await this.service.deletedById(id);
        if (!deleted) {
            req.session.flash = {
                error:HttpStatus.NOT_FOUND,
            };
            return res.redirect('/admin/templates');
        }
        req.session.flash = {
            success:'Template deleted successfully',
        };
        return res.redirect('/admin/templates');
    } catch (error) {
        req.session.flash = {
            error:error.message,
        };
        return res.redirect('/admin/templates');
    }
  }

  @Post('/template/change-status/:id')
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
        const VerificationAttributes = allData?.VerificationAttributes;
        if(VerificationAttributes){
          Object.entries(VerificationAttributes).forEach( async ([key, value]) => {
            await this.service.updateOrCreateIdentity({identityName:key,verificationStatus:value.VerificationStatus,status:true},key);
          });
        }
        res.json({status:'success',message: 'Sync successfully.',data:allData});
      } catch (error) {
        res.json({status:'error',message: error.message});
      }
  }

  @Post('/template/change-identitiy-status/:id')
  async updateIdentitiyStatus(@Param('id') id: string,@Req() req: Request, @Res() res: Response){
      try {
          const data = await this.service.getIdentitiy(id);
         // console.log(data);
          if(data?.status){
            data.status = false;
          }else{
            data.status = true;
          }
          await this.service.updateIdentity({status:data.status},id);
          res.json({status:'success',message: 'Sender status changed successfully.'});
      }catch (error){
          res.json({status:'error',message: error.message});
      }
  }

  @Post('/template/add-identity')
  async addIdentitiy(@Req() req: Request, @Res() res: Response){
      try {
        const data = req?.body||{};
      //  console.log('send req data',req?.body);
        data.status = false;
        data.verificationStatus = 'Pending';
      //  console.log(data,'send data',req?.body);
        const sender = await this.service.updateOrCreateIdentity(data,data.identityName);
        if(sender){
          await sendVerificationEmail(data.identityName);
        }
        res.json({status:'success',message: 'Sender add successfully, An email send on this email please varify email address.'});
      }catch (error){
        res.json({status:'error',message: error.message});
      }
  }

  @Get('/contacts/list')
  @Render('admin/template/contacts_list')
  async contactsList(@Req() req: Request, @Res() res: Response){
    try {
      const clists = await this.service.getContactsData();
      return {layout:'admin',clists};
    } catch (error) {
      req.session.flash = {
        error: error.message,
    };
      return {layout:'admin'};
    }
  }

  @Post('/template/save-contacts')
  @UseInterceptors(FileInterceptor('contacts', {
    storage: diskStorage({
      destination: './public/uploads/files',
      filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
        const extension: string = path.parse(file.originalname).ext;
        cb(null, `${filename}${extension}`);
      },
    }),
  }))
  async saveContacts(@Req() req: Request, @Res() res: Response,@UploadedFile() file){
    try {
      const data = req.body
      var workbook = await XLSX.readFile(file?.path)
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var sheetdata=XLSX.utils.sheet_to_json(worksheet, {raw:true})
      data.contacts=sheetdata;
      await this.service.createContact(data);
     // console.log(data,'post data');
      res.json({status:'success',message: 'Contacts saved successfully.'});
    } catch (error) {
      res.json({status:'error',message: error.message});
    }
      
  }
    
}
