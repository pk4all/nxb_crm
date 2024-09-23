import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Render,Query,
  HttpStatus,
  Res,
  Req, } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';

@UseGuards(SessionGuard)
@Controller('admin')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get('/settings')
  @Render('admin/settings')
  async setting(@Req() req: Request){
    return {layout:'admin'};
  }


  @Get('/settings/subscribers')
  @Render('admin/subscribers')
  async getData(@Query() paginationQuery: PaginationQueryDto, @Query('sortBy') sortBy: string = 'createdAt',@Query('sortOrder') sortOrder: string = 'desc',@Req() req: Request){
    try {
      const {page=1,limit=100} = paginationQuery;
      const datas = await this.settingService.getAllDatas(paginationQuery,sortBy,sortOrder);
      const pagination = await this.settingService.getPaginated(limit, page);
      console.log(datas,'datas');
      return {layout:"admin",datas,pagination}
    } catch (error) {
      req.session.flash = {
        error: error.message,
      };
    }
      return {layout:"admin"}
    return {layout:'admin'};
  }

  @Get('/settings/sync')
  async syncData(@Req() req: Request){
    try {
      //const datas = await this.settingService.getData();
      // for (const item of datas) {
      //   const data = await this.settingService.getSubscriber(item);
      //   if(!data){
      //     await this.settingService.createSubscriber(item);
      //   }
      // }
      return {status:'success',message:'Data Sync'};
    } catch (error) {
      return {status:'error',message:error?.message??'error'};
    }
  }


}
