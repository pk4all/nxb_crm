import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Render,Query,
  HttpStatus,
  Res,
  Req,
  } from '@nestjs/common';
import { FaqService } from './faq.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';

@ApiExcludeController()
@UseGuards(SessionGuard)
@Controller('admin')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

    @Get('/faqs')
    @Render('admin/faq/faqs')
    async allpages(@Query() paginationQuery: PaginationQueryDto, @Query('sortBy') sortBy: string = 'createdAt',@Query('sortOrder') sortOrder: string = 'desc',@Req() req: Request): Promise<{ faqs:any, pagination:any,layout:string}> {
      try {
        const {page=1,limit=5} = paginationQuery;
        const faqs=await this.faqService.getAllFaqs(paginationQuery,sortBy,sortOrder);;
        const pagination = await this.faqService.getPaginatedFaq(limit, page);
        return {layout:'admin',pagination,faqs};

      } catch (error) {
          req.session.flash = {
              error: error.message,
          };
      }
    }

  @Get('/faq/add')
  @Render('admin/faq/add_faq')
  add() {
    return {layout:'admin'};
  }

  @Get('/faq/edit/:id')
  @Render('admin/faq/edit_faq')
  async edit(@Param('id') id: string,@Req() req: Request, @Res() res: Response) {
    try {
      const faq = await this.faqService.getFaq(id);
      return {layout:'admin',faq,id};
    } catch (error) {
      req.session.flash = {
          error: error.message,
      };
    }
  }

  @Post('/faq/create')
  async create(@Req() req: Request, @Res() res: Response) {
    try {
      var data = req?.body||{};
      if(data.status=='on'){
          data.status=true;
      }else{
          data.status=false;
      }
      const faq = await this.faqService.create(data);
      res.json({status:'success',message: 'Faq successfully created.',data:faq});
    } catch (error) {
        res.json({status:'error',message: error.message});
    }
  }

  @Post('/faq/update/:id')
  async update(@Body() body:any ,@Param('id') id: string,@Req() req: Request, @Res() res: Response) {
    try {
      var data = req?.body;
      if(data.status=='on'){
          data.status=true;
      }else{
          data.status=false;
      }
      //console.log(data,'Data');
      const page = await this.faqService.updateFaq(data,id);
      res.json({status:'success',message: 'Faq successfully Updated.',data:page});
    } catch (error) {
        res.json({status:'error',message: error.message});
    }
  }

  @UseGuards(SessionGuard)
    @Post('/faq/delete/:id')
    async deleteType( @Param('id') id: string,@Req() req: Request, @Res() res: Response) {
        try {
            const deleted = await this.faqService.deletedById(id);
            if (!deleted) {
                req.session.flash = {
                    error:HttpStatus.NOT_FOUND,
                };
                return res.redirect('/admin/faqs');
            }
            req.session.flash = {
                success:'Faq deleted successfully',
            };
            return res.redirect('/admin/faqs');
        } catch (error) {
            req.session.flash = {
                error:error.message,
            };
            return res.redirect('/admin/faqs');
        }
    }

  @Post('/faq/change-status/:id')
    async updateStatus(@Param('id') id: string,@Req() req: Request, @Res() res: Response){
        var data = req?.body||{};
        try {
            const pageData = await this.faqService.getFaq(id);
            if(pageData?.status){
              pageData.status = false;
            }else{
              pageData.status = true;
            }
            await this.faqService.updateFaq({status:pageData.status},id);
            res.json({status:'success',message: 'Faq status changed successfully.'});
        }catch (error){
            res.json({status:'error',message: error.message});
        }
    }
    
}
