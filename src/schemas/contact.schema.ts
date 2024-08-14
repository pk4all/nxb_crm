import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';

export type ContactDocument = HydratedDocument<Contact>;

@Schema({timestamps: true})
export class Contact {
  @Prop()
  id: string;

  @Prop({required: true})
  name: string;

  @Prop({type:Types.Array})
  contacts: object;

  @Prop({default:true})
  status:boolean;

  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;
}
export const ContactSchema = SchemaFactory.createForClass(Contact);
