import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { Template,TemplateSchema } from 'src/schemas/template.schema';
import { Identity,IdentitySchema } from 'src/schemas/identity.schema';
import { Contact,ContactSchema } from 'src/schemas/contact.schema';
import { Campaign,CampaignSchema } from 'src/schemas/campaign.schema';
import { CampaignResponse, CampaignResponseSchema } from 'src/schemas/campaign.response.schema';
import { CampaignEventListener } from './campaign.event.listener';

@Module({
  imports:[MongooseModule.forFeature([
    {name:Template.name,schema:TemplateSchema},
    {name:Identity.name,schema:IdentitySchema},
    {name:Contact.name,schema:ContactSchema},
    {name:Campaign.name,schema:CampaignSchema},
    {name:CampaignResponse.name,schema:CampaignResponseSchema},
  ])],
  controllers: [CampaignController],
  providers: [CampaignService,CampaignEventListener],
})
export class CampaignModule {}
