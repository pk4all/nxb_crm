import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';

export type SubscriberDocument = HydratedDocument<Subscriber>;

@Schema({timestamps: true})
export class Subscriber {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;
  
  @Prop()
  phone: string;

  @Prop()
  description: string;
  
  @Prop()
  state: string;

  @Prop()
  pincode: string;

  @Prop({default:true})
  status:boolean;

  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;
}
export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
