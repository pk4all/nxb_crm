import { Controller, Get, Post,Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  

  @Get('/survey')
  @Render('survey')
  getSurvey(){
    return {message:this.appService.getHello(),layout:'web'};
  }
  
}
