import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types } from 'mongoose';

export type PermissionsDocument = HydratedDocument<Permission>;

@Schema({timestamps: true})
export class Permission {
 
  @Prop()
  path: string;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  method: string;

  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;
}
export const PermissionSchema = SchemaFactory.createForClass(Permission);
