import { Schema } from 'mongoose';

export const SEOSchema = new Schema({
  title: { type: String },
  description: { type: String},
  keywords: { type: String},
  ogTags: { type: String}
});