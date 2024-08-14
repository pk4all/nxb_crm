import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';

export type IdentityDocument = HydratedDocument<Identity>;

@Schema({timestamps: true})
export class Identity {
  @Prop()
  id: string;

  @Prop({required: true})
  identityName: string;

  @Prop()
  verificationStatus: string;

  @Prop({default:true})
  status:boolean;

  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;
}
export const IdentitySchema = SchemaFactory.createForClass(Identity);
