import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { EmailTemplate,EmailTemplateSchema } from 'src/schemas/emailtemplate.schema';
import { Identity,IdentitySchema } from 'src/schemas/identity.schema';
import { Contact,ContactSchema } from 'src/schemas/contact.schema';
import { Campaign,CampaignSchema } from 'src/schemas/campaign.schema';
import { CampaignEventListener } from './campaign.event.listener';
@Module({
  imports:[MongooseModule.forFeature([
    {name:EmailTemplate.name,schema:EmailTemplateSchema},
    {name:Identity.name,schema:IdentitySchema},
    {name:Contact.name,schema:ContactSchema},
    {name:Campaign.name,schema:CampaignSchema},
  ])],
  controllers: [CampaignController],
  providers: [CampaignService,CampaignEventListener],
})
export class CampaignModule {}
