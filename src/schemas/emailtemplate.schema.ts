import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';

export type EmailTemplateDocument = HydratedDocument<EmailTemplate>;

@Schema({timestamps: true})
export class EmailTemplate {
  @Prop()
  id: string;

  @Prop({required: true})
  templateName: string;

  @Prop({required: true})
  templateSlug: string;

  @Prop({required: true})
  templateSubject: string;

  @Prop({required: true})
  templateContent: string;

  @Prop({default:true})
  type:string;

  @Prop({default:true})
  status:boolean;

  @Prop()
  resourceId:string;


  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;
}
export const EmailTemplateSchema = SchemaFactory.createForClass(EmailTemplate);
