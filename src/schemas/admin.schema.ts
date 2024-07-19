import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
export type AdminDocument = HydratedDocument<Admin>;
const timeZone = [];

@Schema({timestamps: true})
export class Admin extends Document {

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

AdminSchema.pre<Admin>('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    if(this.password && this.isModified('password')){
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});
AdminSchema.pre<Admin>('findOneAndUpdate', async function(next) {
  const saltOrRounds = 10;
  const password= this.get('password');
  if(password){
    this.set({ password: await bcrypt.hash(password, saltOrRounds) });
  }
  next();
});