import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { EmailTemplate } from 'src/schemas/emailtemplate.schema';
import { Identity } from 'src/schemas/identity.schema';
import { Contact } from 'src/schemas/contact.schema';
import { Campaign } from 'src/schemas/campaign.schema';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
const mongoose = require('mongoose');

@Injectable()
export class CampaignService {
    constructor(
        @InjectModel(EmailTemplate.name) private templateModel: Model<EmailTemplate>,
        @InjectModel(Identity.name) private identityModel: Model<Identity>,
        @InjectModel(Contact.name) private contactModel: Model<Contact>,
        @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
    ){}

    async getTemplatesList(){
        try {
            return await this.templateModel.find({status:true},{'templateName':1,"templateSlug":1}).lean().exec();
        } catch (error) {
            throw new Error(error?.message||'Data not Found');
        }
    }
    async getSendersList(){
        try {
            return await this.identityModel.find({status:true},{'identityName':1}).lean().exec();
        } catch (error) {
            throw new Error(error?.message||'Data not Found');
        }
    }

    async getContactsList(){
        try {
            return await this.contactModel.find({status:true},{'name':1}).lean().exec();
        } catch (error) {
            throw new Error(error?.message||'Data not Found');
        }
    }

    async createCampaign(jsonData:any){
        try {
            return await this.campaignModel.create(jsonData);
        } catch (error) {
            throw new Error(error?.message||'Data not saved');
        }
    }

    async getAllDatas(paginationQuery: PaginationQueryDto,sortBy: string, sortOrder: string): Promise<Campaign[]>{
        try {
            const { limit, search,page=1} = paginationQuery;
            const sortCriteria:any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
            const query = search ? { title: new RegExp(search, 'i') } : {};
            const l = limit||5;
            const ofs = ((page-1)*l);
            return await this.campaignModel
            .find(query)
            .skip(ofs)
            .limit(l)
            .sort(sortCriteria)
            .lean()
            .exec();
        } catch (error) {
            throw new Error(error?.message||'Data not Found');
        }
        
      }
    
      async getPaginated(limit: number, page: number): Promise<any> {
        try {
            const total = await this.campaignModel.countDocuments().exec();
            const totalPages = Math.ceil(total / limit);
            const usedPage:string = String(page);
            const paginationData = {
                limit: limit,
                page: page,
                totalPages,
                pageMinusOne: parseInt(usedPage) - 1,
                pagePlusOne: parseInt(usedPage) + 1,
                pages: Array.from({ length: totalPages }, (_, i) => i + 1)
                };
            return paginationData;
        } catch (error) {
            throw new Error(error?.message||'Data not Found');
        }    
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
                  {
                    $unwind: '$templates'
                  },
                  {
                    $project: {
                      name: 1,
                      status: 1,
                      template:1,
                      sender:1,
                      type:1,
                      campaignStatus:1,
                      'contacts.name': 1,
                      'contacts.contacts':{ $size: '$contacts.contacts' },
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

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async sendEmailsWithRateLimit(destinations, batchSize = 1, delayTime = 1000) {
        for (let i = 0; i < destinations.length; i += batchSize) {
          const batch = destinations.slice(i, i + batchSize);
         // await this.sendBatch(batch);
          await this.delay(delayTime); // Delay between each batch
        }
      }
    
    //   async sendBatch(batch) {
    //     const params = {
    //       Source: "your-email@example.com",
    //       Template: templateName,
    //       DefaultTemplateData: JSON.stringify({
    //         firstName: "Customer",
    //         lastName: "Surname",
    //       }),
    //       Destinations: batch,
    //     };
    
    //     try {
    //       const command = new SendBulkTemplatedEmailCommand(params);
    //       const response = await client.send(command);
    //       console.log("Batch sent successfully:", response);
    //     } catch (error) {
    //       console.error("Error sending batch:", error);
    //     }
    //   }
    
}
