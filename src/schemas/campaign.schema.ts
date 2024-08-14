import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';

export type CampaignDocument = HydratedDocument<Campaign>;

@Schema({timestamps: true})
export class Campaign {
  @Prop()
  id: string;

  @Prop({required: true})
  name: string;

  @Prop({required: true})
  template: string;

  @Prop({required: true,type:Types.ObjectId})
  contact:string;

  @Prop({required: true})
  sender: string;

  @Prop({default:'email'})
  type:string;

  @Prop({default:'created'})
  campaignStatus:string;

  @Prop({default:true})
  status:boolean;

  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;
}
export const CampaignSchema = SchemaFactory.createForClass(Campaign);
