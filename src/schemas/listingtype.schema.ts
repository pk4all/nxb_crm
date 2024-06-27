import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ListingTypeDocument = HydratedDocument<ListingType>;

@Schema({timestamps: true})
export class ListingType {

  @Prop()
  id: string;

  @Prop()
  name: string;

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

export const ListingTypeSchema = SchemaFactory.createForClass(ListingType);


//Wizcad#2024
//wizcad