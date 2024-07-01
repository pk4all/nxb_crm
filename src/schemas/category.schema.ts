import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';
import { SEOSchema } from './seo.schema';
import { CustomFieldSchema } from './customfield.schema';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({timestamps: true})
export class Category {
  @Prop()
  id: string;

  @Prop({default:null})
  parentId: string;
  @Prop()
  parentName: string;

  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  icon: string;

  @Prop()
  image: string;

  @Prop()
  description:string;

  @Prop({default:false})
  hideDescription:boolean;

  @Prop({type:Types.Array})
  customFields:object;

  @Prop()
  typeId:string;

  @Prop()
  typeName:string;

  @Prop({type:SEOSchema})
  seo:object;

  @Prop({default:true})
  dedicateForPermanentListings:boolean;

  @Prop({default:true})
  status:boolean;

  @Prop({default:false})
  childrenStatus:boolean;

  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
