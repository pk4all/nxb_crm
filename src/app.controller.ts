import { Controller, Get, Post,Render } from '@nestjs/common';
import { AppService } from './app.service';
import QRCode from 'qrcode';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  

  @Get('/survey')
  @Render('survey')
  getSurvey(){
    return {message:this.appService.getHello(),layout:'web'};
  }

  @Get('/qr')
  @Render('qr')
  async getQr(){
 
    // QRCode.toDataURL('I am a pony!', function (err, url) {
    //   console.log(url)
    // });
    QRCode.toString('http://nextbuying.in',{type:'terminal'}, function (err, url) {
      console.log(url)
    });
    //const q =  await QRCode.toString('http://nextbuying.in');
    const qn =  await QRCode.toDataURL('http://nextbuying.in' ,{

    });
    return {qn,layout:'web'};
  }


  
}
