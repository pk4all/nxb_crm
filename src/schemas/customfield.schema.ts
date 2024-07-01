import { Schema } from 'mongoose';

const OptionSchema = new Schema({
  text: { type: String }
});

export const CustomFieldSchema = new Schema({
  type: { type: String },
  status: { type: Boolean,default:true },
  required: { type: Boolean,default:false},
  fieldName:{type:String},
  fieldKey:{type:String},
  options: { type: OptionSchema } // Nested address field
});