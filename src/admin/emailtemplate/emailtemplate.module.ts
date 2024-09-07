import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailTemplateService } from './emailtemplate.service';
import { EmailTemplateController } from './emailtemplate.controller';
import { Template,TemplateSchema } from 'src/schemas/template.schema';
import { Identity,IdentitySchema } from 'src/schemas/identity.schema';
import { Contact,ContactSchema } from 'src/schemas/contact.schema';
@Module({
  imports:[MongooseModule.forFeature([
    {name:Template.name,schema:TemplateSchema},
    {name:Identity.name,schema:IdentitySchema},
    {name:Contact.name,schema:ContactSchema},
    
  ])],
  controllers: [EmailTemplateController],
  providers: [EmailTemplateService],
})
export class EmailTemplateModule {
  
}
