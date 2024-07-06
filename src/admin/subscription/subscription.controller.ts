import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Render,Query,
  HttpStatus,
  Res,
  Req, } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SessionGuard } from '../../gaurds/session.guard';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';

@ApiExcludeController()
@UseGuards(SessionGuard)
@Controller('admin')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

    @Get('/subscriptions')
    @Render('admin/subscription/subscription_list')
    async allpages(@Query() paginationQuery: PaginationQueryDto, @Query('sortBy') sortBy: string = 'createdAt',@Query('sortOrder') sortOrder: string = 'desc',@Req() req: Request): Promise<{ subscriptions:any, pagination:any,layout:string}> {
      try {
        const {page=1,limit=5} = paginationQuery;
        const subscriptions=await this.subscriptionService.getAllSubScriptions(paginationQuery,sortBy,sortOrder);;
        const pagination = await this.subscriptionService.getPaginatedSubscriptions(limit, page);
        return {layout:'admin',pagination,subscriptions};

      } catch (error) {
          req.session.flash = {
              error: error.message,
          };
      }
    }

  @Get('/subscription/add')
  @Render('admin/subscription/add_subscription')
  add() {
    return {layout:'admin'};
  }

  @Get('/subscription/edit/:id')
  @Render('admin/subscription/edit_subscription')
  async edit(@Param('id') id: string,@Req() req: Request, @Res() res: Response) {
    try {
      const subscription = await this.subscriptionService.getSubscription(id);
      return {layout:'admin',subscription,id};
    } catch (error) {
      req.session.flash = {
          error: error.message,
      };
    }
  }

  @Post('/subscription/create')
  async create(@Req() req: Request, @Res() res: Response) {
    try {
      var data = req?.body||{};
      if(data.status=='on'){
          data.status=true;
      }else{
          data.status=false;
      }
      const subscription = await this.subscriptionService.create(data);
      res.json({status:'success',message: 'Subscription successfully created.',data:subscription});
    } catch (error) {
        res.json({status:'error',message: error.message});
    }
  }

  @Post('/subscription/update/:id')
  async update(@Body() body:any ,@Param('id') id: string,@Req() req: Request, @Res() res: Response) {
    try {
      var data = req?.body;
      if(data.status=='on'){
          data.status=true;
      }else{
          data.status=false;
      }
      //console.log(data,'Data');
      const subscription = await this.subscriptionService.update(data,id);
      res.json({status:'success',message: 'Subscription successfully Updated.',data:subscription});
    } catch (error) {
        res.json({status:'error',message: error.message});
    }
  }

  @UseGuards(SessionGuard)
    @Post('/subscription/delete/:id')
    async deleteType( @Param('id') id: string,@Req() req: Request, @Res() res: Response) {
        try {
            const deleted = await this.subscriptionService.deletedById(id);
            if (!deleted) {
                req.session.flash = {
                    error:HttpStatus.NOT_FOUND,
                };
                return res.redirect('/admin/subscriptions');
            }
            req.session.flash = {
                success:'Subscription deleted successfully',
            };
            return res.redirect('/admin/subscriptions');
        } catch (error) {
            req.session.flash = {
                error:error.message,
            };
            return res.redirect('/admin/subscriptions');
        }
    }

  @Post('/subscription/change-status/:id')
    async updateStatus(@Param('id') id: string,@Req() req: Request, @Res() res: Response){
        var data = req?.body||{};
        try {
            const data = await this.subscriptionService.getSubscription(id);
            if(data?.status){
              data.status = false;
            }else{
              data.status = true;
            }
            await this.subscriptionService.update({status:data.status},id);
            res.json({status:'success',message: 'Subscription status changed successfully.'});
        }catch (error){
            res.json({status:'error',message: error.message});
        }
    }
}
