import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Render,Query,
  HttpStatus,
  Res,
  Req } from '@nestjs/common';
import { AdsService } from './ads.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';

@ApiExcludeController()
@UseGuards(SessionGuard)
@Controller('admin')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get('/ads')
    @Render('admin/ads/ads')
    async allpages(@Query() paginationQuery: PaginationQueryDto, @Query('sortBy') sortBy: string = 'createdAt',@Query('sortOrder') sortOrder: string = 'desc',@Req() req: Request): Promise<{ ads:any, pagination:any,layout:string}> {
      try {
        const {page=1,limit=5} = paginationQuery;
        const ads=await this.adsService.getAllAds(paginationQuery,sortBy,sortOrder);;
        const pagination = await this.adsService.getPaginatedAds(limit, page);
        return {layout:'admin',pagination,ads};

      } catch (error) {
          req.session.flash = {
              error: error.message,
          };
      }
    }

  @Get('/ads/add')
  @Render('admin/ads/add_ads')
  add() {
    return {layout:'admin'};
  }

  @Get('/ads/edit/:id')
  @Render('admin/ads/edit_ads')
  async edit(@Param('id') id: string,@Req() req: Request, @Res() res: Response) {
    try {
      const ads = await this.adsService.getAds(id);
      return {layout:'admin',ads,id};
    } catch (error) {
      req.session.flash = {
          error: error.message,
      };
    }
  }

  @Post('/ads/create')
  async create(@Req() req: Request, @Res() res: Response) {
    try {
      var data = req?.body||{};
      if(data.status=='on'){
          data.status=true;
      }else{
          data.status=false;
      }
      const ads = await this.adsService.create(data);
      res.json({status:'success',message: 'Ads successfully created.',data:ads});
    } catch (error) {
        res.json({status:'error',message: error.message});
    }
  }

  @Post('/ads/update/:id')
  async update(@Body() body:any ,@Param('id') id: string,@Req() req: Request, @Res() res: Response) {
    try {
      var data = req?.body;
      if(data.status=='on'){
          data.status=true;
      }else{
          data.status=false;
      }
      const ads = await this.adsService.update(data,id);
      res.json({status:'success',message: 'Ads successfully Updated.',data:ads});
    } catch (error) {
        res.json({status:'error',message: error.message});
    }
  }

  @UseGuards(SessionGuard)
    @Post('/ads/delete/:id')
    async deleteType( @Param('id') id: string,@Req() req: Request, @Res() res: Response) {
        try {
            const deleted = await this.adsService.deletedById(id);
            if (!deleted) {
                req.session.flash = {
                    error:HttpStatus.NOT_FOUND,
                };
                return res.redirect('/admin/ads');
            }
            req.session.flash = {
                success:'Ads deleted successfully',
            };
            return res.redirect('/admin/ads');
        } catch (error) {
            req.session.flash = {
                error:error.message,
            };
            return res.redirect('/admin/ads');
        }
    }



  @Post('/ads/change-status/:id')
    async updateStatus(@Param('id') id: string,@Req() req: Request, @Res() res: Response){
        var data = req?.body||{};
        try {
            const ads = await this.adsService.getAds(id);
            if(ads?.status){
              ads.status = false;
            }else{
              ads.status = true;
            }
            await this.adsService.update({status:ads.status},id);
            res.json({status:'success',message: 'Ads status changed successfully.'});
        }catch (error){
            res.json({status:'error',message: error.message});
        }
    }
  
}
