import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';
import { SEOSchema } from './seo.schema';
import { CustomFieldSchema } from './customfield.schema';

export type FormResponseDocument = HydratedDocument<FormResponse>;

@Schema({timestamps: true})
export class FormResponse {
  @Prop()
  id: string;

  @Prop()
  uId: string;

  @Prop()
  sessionId: string;

  @Prop()
  formId: string;

  @Prop()
  formResponseType: string;

  @Prop({type:Types.Array})
  responses:object;


  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;
}
export const FormResponseSchema = SchemaFactory.createForClass(FormResponse);
