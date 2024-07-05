import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

const timeZone = [

];

@Schema({timestamps: true})
export class Admin {

  @Prop({ref: 'Role'})
  role: string;

  @Prop()
  roleName: string;

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
  status:boolean;

  @Prop()
  timeZone: string;

  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;


}

export const AdminSchema = SchemaFactory.createForClass(Admin);