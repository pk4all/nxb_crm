import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FieldTypeDocument = HydratedDocument<FieldType>;

@Schema({timestamps: true})
export class FieldType {

  @Prop()
  id: string;

  @Prop()
  name: string;
  @Prop()
  type: string;

  @Prop()
  slug: string;

  @Prop()
  status:boolean;
  
  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;

  @Prop()
  createdBy:string;

  @Prop()
  updatedBy:string;
  
}

export const FieldTypeSchema = SchemaFactory.createForClass(FieldType);


//Wizcad#2024
//wizcad