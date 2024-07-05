import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';

export type FaqDocument = HydratedDocument<Faq>;

@Schema({timestamps: true})
export class Faq {
  @Prop()
  id: string;

  @Prop({required: true})
  question: string;

  @Prop({required: true})
  answer: string;

  @Prop({default:true})
  status:boolean;

  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;
}
export const FaqSchema = SchemaFactory.createForClass(Faq);
