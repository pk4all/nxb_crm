import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailTemplateService } from './emailtemplate.service';
import { EmailTemplateController } from './emailtemplate.controller';
import { EmailTemplate,EmailTemplateSchema } from 'src/schemas/emailtemplate.schema';
@Module({
  imports:[MongooseModule.forFeature([
    {name:EmailTemplate.name,schema:EmailTemplateSchema},
  ])],
  controllers: [EmailTemplateController],
  providers: [EmailTemplateService],
})
export class EmailTemplateModule {}
