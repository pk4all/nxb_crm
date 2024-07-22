import { Module } from '@nestjs/common';
import { WebService } from './web.service';
import { WebController } from './web.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category,CategorySchema } from 'src/schemas/category.schema';
import { FieldType,FieldTypeSchema } from 'src/schemas/fieldtype.schema';
import {Form, FormSchema} from 'src/schemas/form.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Category.name,schema:CategorySchema}]),
    MongooseModule.forFeature([{name:FieldType.name,schema:FieldTypeSchema}]),
    MongooseModule.forFeature([{name:Form.name,schema:FormSchema}])
  ],
  providers: [WebService],
  controllers: [WebController]
})
export class WebModule {}
