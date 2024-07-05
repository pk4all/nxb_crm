import { Module } from '@nestjs/common';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ads,AdsSchema } from 'src/schemas/ads.schema';

@Module({
  imports:[MongooseModule.forFeature([
    {name:Ads.name,schema:AdsSchema},
  ])],
  controllers: [AdsController],
  providers: [AdsService],
})
export class AdsModule {}
