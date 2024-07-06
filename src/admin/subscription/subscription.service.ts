import { Injectable ,ConflictException} from '@nestjs/common';
import { Subscription } from 'src/schemas/subscription.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>,
      ){}

      async create(jsonData:any) {
        try {
          return await this.subscriptionModel.create(jsonData);
        } catch (error) {
          throw new ConflictException(error?.message||'Data not saved');
        }
      }
    
      async getAllSubScriptions(paginationQuery: PaginationQueryDto,sortBy: string, sortOrder: string): Promise<Subscription[]>{
        const { limit, search,page=1} = paginationQuery;
        const sortCriteria:any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const query = search ? { title: new RegExp(search, 'i') } : {};
        const l = limit||5;
        const ofs = ((page-1)*l);
        return this.subscriptionModel
          .find(query)
          .skip(ofs)
          .limit(l)
          .sort(sortCriteria)
          .lean()
          .exec();
      }
    
      async getPaginatedSubscriptions(limit: number, page: number): Promise<any> {
          const total = await this.subscriptionModel.countDocuments().exec();
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
      }
    
      async update(jsonData:any,id){
        try {
           //console.log(jsonData,id);
          return  await this.subscriptionModel.findByIdAndUpdate(id,jsonData);
        } catch (error) {
          throw new ConflictException(error?.message||'Data not saved');
        }
      }
    
      async getSubscription(id:string){
        try {
          return await this.subscriptionModel.findById(id).lean().exec();
        } catch (error) {
          throw new ConflictException(error?.message||'No Data');
        }
      }
    
      async deletedById(id:string){
          return this.subscriptionModel.findByIdAndDelete(id).exec();
      }
}
