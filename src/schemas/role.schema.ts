import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';
import { SEOSchema } from './seo.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({timestamps: true})
export class Role {
  @Prop()
  id: string; 


  @Prop()
  name: string;

  @Prop({type:Types.Array})
  permissions:object;


  @Prop({default:true})
  status:boolean;

  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;
}
export const RoleSchema = SchemaFactory.createForClass(Role);
