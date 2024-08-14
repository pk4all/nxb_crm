import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';

export type SettingDocument = HydratedDocument<Setting>;

@Schema({timestamps: true})
export class Setting {
  @Prop()
  id: string;

  @Prop({type:Types.Array})
  SesSendingLimit: object;


  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;
}
export const SettingSchema = SchemaFactory.createForClass(Setting);
