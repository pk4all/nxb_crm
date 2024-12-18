import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types} from 'mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import { CampaignSendEvent } from 'src/common/events/campaign-send.event';
import { Campaign } from 'src/schemas/campaign.schema';
import { CampaignResponse } from 'src/schemas/campaign.response.schema';

const mongoose = require('mongoose');
import {getSendingStatistics,sendBulkTemplatedEmail} from 'src/common/utils/ses.utility';

const chunk = (arr, size) =>Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
@Injectable()
export class CampaignEventListener {
    constructor(
        @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
        @InjectModel(CampaignResponse.name) private campaignResponseModel: Model<CampaignResponse>,

    ){}
    @OnEvent('campaign.send')
    async handleCampaignSendEvent(event:CampaignSendEvent) {
        const campaignData = await this.getCampaign(event.campaignId);
        const getSesLimit = await getSendingStatistics();
        const maxSendRate = getSesLimit.MaxSendRate;
        // console.log(campaignData,maxSendRate,event.campaignId);
        // return;
        const contactsList = campaignData.contacts.contacts.map(elm=>{
            let d = elm;
            return {
                Destination: {
                    ToAddresses: [
                        d.email,
                    ],
                  },
                  ReplacementTemplateData: JSON.stringify(d),
            };
        });
        const chunkDestinations = chunk(contactsList,maxSendRate);
        for (let i = 0; i < chunkDestinations.length; i++) {
            const destinations = chunkDestinations[i];
            const statedTime = Date.now();
            try {
                const res = await sendBulkTemplatedEmail(campaignData.sender,campaignData.template,destinations);
                const endedTime = Date.now();
                await this.delay(1000);// Delay between each batch
                const saveCampdata ={batch:i+1,response:res,campaignId:campaignData._id,startedAt:statedTime,endedAt:endedTime,sendingRate:maxSendRate,takenTime:endedTime-statedTime};
                await this.campaignResponseModel.create(saveCampdata);
            } catch (error) {
                const endedTime = Date.now();
                const saveCampdata ={batch:i+1,response:error,campaignId:campaignData._id,startedAt:statedTime,endedAt:endedTime,sendingRate:maxSendRate,takenTime:endedTime-statedTime};
                await this.campaignResponseModel.create(saveCampdata);
            }
            console.log('saveCampdata',i);
          }
        
        console.log(`campaign send with ID: ${event.campaignId}`);
        await this.campaignModel.findByIdAndUpdate(event.campaignId,{campaignStatus:'done'});
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async getCampaign(id){
        try {
            const objectId = new mongoose.Types.ObjectId(id);
            const campaign =  await this.campaignModel.aggregate([
                { $match: { _id:objectId } },
                {
                    $lookup: {
                    from: "contacts",
                    localField: "contact",
                    foreignField: "_id",
                    as: "contacts"
                    },
                },
                {
                    $unwind: '$contacts'
                },
                {
                    $lookup: {
                    from: "emailtemplates",
                    localField: "template",
                    foreignField: "templateSlug",
                    as: "templates"
                    },
                },
                // {
                //     $unwind: '$templates'
                // },
                {
                    $project: {
                    name: 1,
                    status: 1,
                    template:1,
                    sender:1,
                    type:1,
                    campaignStatus:1,
                    'contacts.name': 1,
                    'contacts.contacts':1,
                    'contacts.status': 1,
                    'templates.templateName':1,
                    'templates.templateSubject':1
                    }
                }

            ]).exec();
            return campaign[0];
        } catch (error) {
            throw new Error(error?.message||'Data not Found');
        }
    }
}
