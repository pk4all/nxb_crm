import { Controller,UseGuards,Get,Post,Render,Req,Res,Query,Param } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { Response, Request } from 'express';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CampaignSendEvent } from 'src/common/events/campaign-send.event';
import { sendWelcomeTemplateMessage } from 'src/common/utils/whatsapp.utility';
const { ObjectId } = require('mongodb');

@UseGuards(SessionGuard)
@Controller('admin')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService,private eventEmitter: EventEmitter2) {}

  @Get('/campaign')
  @Render('admin/campaign/list')
  async campaign(@Query() paginationQuery: PaginationQueryDto, @Query('sortBy') sortBy: string = 'createdAt',@Query('sortOrder') sortOrder: string = 'desc',@Req() req: Request){
    try {
      const templates= await this.campaignService.getTemplatesList();
      const senders= await this.campaignService.getSendersList();
      const contacts= await this.campaignService.getContactsList();
      const campaigns = await this.campaignService.getAllDatas(paginationQuery,sortBy,sortOrder);
      return {layout:"admin",templates,senders,contacts,campaigns}
    } catch (error) {
      req.session.flash = {
        error: error.message,
    };
      return {layout:"admin"}
    }
  }

  @Get('/campaign/view/:id')
  @Render('admin/campaign/view')
  async view(@Param('id') id: string,@Req() req: Request, @Res() res: Response) {
    try {
      const campaign = await this.campaignService.getCampaign(id);
      // console.log(campaign);
      return {layout:'admin',campaign};
    } catch (error) {
      return {layout:'admin'};
    }
  }

  @Post('/campaign/create')
  async campaignCreate(@Req() req: Request, @Res() res: Response){
    var reqdata = req?.body||{};
    try {
      if(reqdata?.contact){
        reqdata.contact = new ObjectId(reqdata.contact);
      }
      const data = await this.campaignService.createCampaign(reqdata);
      res.json({status:'success',message: 'Campaign successfully created.',data:data});
    } catch (error) {
      res.json({status:'error',message: error.message});
    }
  }

  @Post('/campaign/sent/:id')
  async sentCampaign(@Param('id') id: string,@Req() req: Request, @Res() res: Response){
    try {
      this.eventEmitter.emit('campaign.send', new CampaignSendEvent(id));
      this.campaignService.updateCampaign({campaignStatus:'sending'},id)
      res.json({status:'success',message: 'Campaign successfully start.'});
    } catch (error) {
      res.json({status:'error',message: error.message});
    }
  }

  @Get('/campaign/whatsapp')
  async sendWhatsApp(){
    try {
      return await sendWelcomeTemplateMessage(918076980839);
    } catch (error) {
      return error.message;
    }
  }

}
