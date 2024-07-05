import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Render,Query,
  HttpStatus,
  Res,
  Req,
  UploadedFile,
  UseInterceptors} from '@nestjs/common';
import { PageService } from './page.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@ApiExcludeController()
@UseGuards(SessionGuard)
@Controller('admin')
export class PageController {
  constructor(private readonly pageService: PageService) {}

 

  @Get('/pages')
  @Render('admin/page/pages')
  async allpages(@Query() paginationQuery: PaginationQueryDto, @Query('sortBy') sortBy: string = 'createdAt',@Query('sortOrder') sortOrder: string = 'desc',@Req() req: Request): Promise<{ pages:any, pagination:any,layout:string}> {
    try {
      const {page=1,limit=5} = paginationQuery;
      const pages=await this.pageService.getAllPages(paginationQuery,sortBy,sortOrder);;
      const pagination = await this.pageService.getPaginatedPage(limit, page);
      return {layout:'admin',pagination,pages};

    } catch (error) {
        req.session.flash = {
            error: error.message,
        };
    }
  }

  @Get('/page/add')
  @Render('admin/page/add_page')
  add() {
    return {layout:'admin'};
  }

  @Get('/page/edit/:id')
  @Render('admin/page/edit_page')
  async edit(@Param('id') id: string,@Req() req: Request, @Res() res: Response) {
    try {
      const page = await this.pageService.getPage(id);
      return {layout:'admin',page,id};
    } catch (error) {
      req.session.flash = {
          error: error.message,
      };
    }
  }

  @Post('/page/create')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/uploads/page',
      filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
        const extension: string = path.parse(file.originalname).ext;
        cb(null, `${filename}${extension}`);
      },
    }),
  }))
  async create(@Req() req: Request, @Res() res: Response,@UploadedFile() file) {
    try {
      var data = req?.body||{};
      if(file){
          data.image=file?.filename;
      }
      if(data.status=='on'){
          data.status=true;
      }else{
          data.status=false;
      }
      const page = await this.pageService.create(data);
      res.json({status:'success',message: 'Page successfully created.',data:page});
    } catch (error) {
        res.json({status:'error',message: error.message});
    }
  }

  @Post('/page/update/:id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/uploads/page',
      filename: (req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
        const extension: string = path.parse(file.originalname).ext;
        cb(null, `${filename}${extension}`);
      },
    }),
  }))
  async update(@Param('id') id: string,@Req() req: Request, @Res() res: Response,@UploadedFile() file) {
    try {
      var data = req?.body||{};
      if(file){
          data.image=file?.filename;
      }
      if(data.status=='on'){
          data.status=true;
      }else{
          data.status=false;
      }
      const page = await this.pageService.updatePage(data,id);
      res.json({status:'success',message: 'Page successfully Updated.',data:page});
    } catch (error) {
        res.json({status:'error',message: error.message});
    }
  }

  @UseGuards(SessionGuard)
    @Post('/page/delete/:id')
    async deleteType(@Param('id') id: string,@Req() req: Request, @Res() res: Response) {
        try {
            const deleted = await this.pageService.deletedById(id);
            if (!deleted) {
                req.session.flash = {
                    error:HttpStatus.NOT_FOUND,
                };
                return res.redirect('/admin/pages');
            }
            req.session.flash = {
                success:'Page deleted successfully',
            };
            return res.redirect('/admin/pages');
        } catch (error) {
            req.session.flash = {
                error:error.message,
            };
            return res.redirect('/admin/pages');
        }
    }



  @Post('/page/change-status/:id')
    async updateStatus(@Param('id') id: string,@Req() req: Request, @Res() res: Response){
        var data = req?.body||{};
        try {
            const pageData = await this.pageService.getPage(id);
            if(pageData?.status){
              pageData.status = false;
            }else{
              pageData.status = true;
            }
            await this.pageService.updatePage({status:pageData.status},id);
            res.json({status:'success',message: 'Category status changed successfully.'});
        }catch (error){
            res.json({status:'error',message: error.message});
        }
    }



}
