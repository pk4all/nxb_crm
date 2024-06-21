import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({timestamps: true})
export class Admin {

  @Prop()
  name: string;

  // @Prop()
  // profileImage: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: number;

  @Prop()
  password: string;

  // @Prop()
  // dob:string;

  @Prop()
  token: string;

  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;


}

export const AdminSchema = SchemaFactory.createForClass(Admin);