import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';
import { SEOSchema } from './seo.schema';

export type PageDocument = HydratedDocument<Page>;

@Schema({timestamps: true})
export class Page {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  icon: string;

  @Prop()
  image: string;

  @Prop()
  description:string;

  @Prop({type:SEOSchema})
  seo:object;

  @Prop({default:true})
  status:boolean;

  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;
}
export const PageSchema = SchemaFactory.createForClass(Page);
