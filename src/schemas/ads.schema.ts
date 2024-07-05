import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';

export type AdsDocument = HydratedDocument<Ads>;

@Schema({timestamps: true})
export class Ads {
  @Prop()
  id: string;

  @Prop({required: true})
  name: string;

  @Prop()
  trackingCode: string;

  @Prop()
  trackingCodeTablet: string;

  @Prop()
  trackingCodeMobile: string;

  @Prop()
  position:string;

  @Prop()
  provider:string;

  @Prop()
  page:string;

  @Prop({default:true})
  status:boolean;

  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;
}
export const AdsSchema = SchemaFactory.createForClass(Ads);
