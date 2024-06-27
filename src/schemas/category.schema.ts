import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({timestamps: true})
export class Category {

  @Prop()
  id: string;

  @Prop()
  parentId: string;
  @Prop()
  parentName: string;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  icon: string;

  @Prop()
  image: string;

  @Prop()
  description:string;

  @Prop()
  hideDescription:boolean;

  @Prop()
  customFields:object;

  @Prop()
  type:object;

  @Prop()
  seoTags:object;

  @Prop()
  dedicateForPermanentListings:boolean;

  @Prop()
  status:boolean;

  @Prop()
  childrenStatus:boolean;

  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;


}

export const CategorySchema = SchemaFactory.createForClass(Category);