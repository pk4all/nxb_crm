import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;
@Schema({timestamps: true})
export class User extends Document {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  profileImage: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: number;

  @Prop()
  password: string;

  @Prop({default:false})
  tnc:boolean;

  @Prop({default:false})
  newslatterSubscribe:boolean;

  @Prop()
  token: string;

  @Prop()
  createdAt:Date;

  @Prop()
  updatedAt:Date;


}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', async function(next) {
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
UserSchema.pre<User>('findOneAndUpdate', async function(next) {
  const saltOrRounds = 10;
  const password= this.get('password');
  if(password){
    this.set({ password: await bcrypt.hash(password, saltOrRounds) });
  }
  next();
});


