import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import { HttpAdapterHost } from '@nestjs/core';
import { Category,CategorySchema } from 'src/schemas/category.schema';
import { FieldType,FieldTypeSchema } from 'src/schemas/fieldtype.schema';
@Module({
  imports:[
    MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),
    MongooseModule.forFeature([{name:Category.name,schema:CategorySchema}]),
    MongooseModule.forFeature([{name:FieldType.name,schema:FieldTypeSchema}])
  ],
  providers: [UserService,HttpAdapterHost],
  controllers: [UserController]
})
export class UserModule {}
