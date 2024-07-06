import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({timestamps: true})
export class Subscription {
  @Prop()
  id: string;

  @Prop({required: true})
  name: string;

  @Prop()
  price: number;

  @Prop()
  duration: number;

  @Prop()
  interval: string;

  @Prop()
  listingLimit: number;

  @Prop()
  description: string;
  
  @Prop({default:true})
  status:boolean;

  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;
}
export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
