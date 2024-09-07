import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';

export type CampaignResponseDocument = HydratedDocument<CampaignResponse>;

@Schema({timestamps: true})
export class CampaignResponse {
  @Prop()
  id: string;

  @Prop()
  campaignId: string;

  @Prop()
  batch: number;

  @Prop({type:Types.Array})
  response:object;

  @Prop()
  startedAt: Date;

  @Prop()
  endedAt: Date;

  @Prop()
  takenTime:string;

  @Prop()
  sendingRate:string;

  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;
}
export const CampaignResponseSchema = SchemaFactory.createForClass(CampaignResponse);
