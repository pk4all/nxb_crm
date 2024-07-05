import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { Page,PageSchema } from 'src/schemas/page.schema';
@Module({
  imports:[MongooseModule.forFeature([
    {name:Page.name,schema:PageSchema},
  ])],
  controllers: [PageController],
  providers: [PageService],
})
export class PageModule {}
