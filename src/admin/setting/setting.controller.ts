import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Render,Query,
  HttpStatus,
  Res,
  Req, } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response, Request } from 'express';

@UseGuards(SessionGuard)
@Controller('admin')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get('/settings')
  @Render('admin/settings')
  async setting(@Req() req: Request){
    return {layout:'admin'};
  }

}
