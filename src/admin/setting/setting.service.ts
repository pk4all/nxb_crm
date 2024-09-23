import { Injectable,Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import * as admin from 'firebase-admin';
import { Subscriber } from 'src/schemas/subscriber.schema';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';

@Injectable()
export class SettingService {
    constructor(
        @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
        @InjectModel(Subscriber.name) private subscriberModel: Model<Subscriber>,
      ) {}

    async getData(){
        try {
            const firestore = this.firebaseAdmin.firestore();
            const users = await firestore.collection('users').get();
            const u = users.docs.map((doc) => {
                let d = doc.data();
                if(d?.email){
                    return{
                        name:d?.fullName??'',
                        email:d?.email??'',
                        phone:d?.phoneNumber??'',
                        state:d?.state??'',
                        pincode:d?.pincode??''
                    };
                }
            });
            return u;
           // return await this.createSubscribers(u);
        } catch (error) {
            throw new Error(error?.message||'Data not saved');
        }
        
    }

    async createSubscribers(jsonData:any){
        try {
            return await this.subscriberModel.insertMany(jsonData);
        } catch (error) {
            throw new Error(error?.message||'Data not saved');
        }
    }

    async createSubscriber(jsonData:any){
        try {
            return await this.subscriberModel.create(jsonData);
        } catch (error) {
            throw new Error(error?.message||'Data not saved');
        }
    }

    async getSubscriber(data){
        try {
            return await this.subscriberModel.findOne({email:data?.email}).lean().exec();
          } catch (error) {
            throw new Error(error?.message||'No Data');
          }
    }

    async getAllDatas(paginationQuery: PaginationQueryDto,sortBy: string, sortOrder: string): Promise<Subscriber[]>{
        try {
            const { limit, search,page=1} = paginationQuery;
            const sortCriteria:any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
            const query = search ? { title: new RegExp(search, 'i') } : {};
            const l = limit||100;
            const ofs = ((page-1)*l);
            return await this.subscriberModel
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
            const total = await this.subscriberModel.countDocuments().exec();
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
}
