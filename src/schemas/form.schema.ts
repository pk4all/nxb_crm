import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';
import { SEOSchema } from './seo.schema';
import { CustomFieldSchema } from './customfield.schema';

export type FormDocument = HydratedDocument<Form>;

@Schema({timestamps: true})
export class Form {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  type: string;

  @Prop()
  typeName: string;

  @Prop()
  description:string;

  @Prop()
  profileImage:string;

  @Prop()
  coverImage:string;

  @Prop({default:true})
  status:boolean;

  @Prop({default:'public'})
  visibility:string;

  @Prop()
  icon: string;


  @Prop({type:Types.Array})
  fields:object;


  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;
}
export const FormSchema = SchemaFactory.createForClass(Form);
