import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Admin, AdminSchema } from '../../schemas/admin.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports:[MongooseModule.forFeature([{name:Admin.name,schema:AdminSchema}])],
  providers: [UserService],
  controllers: [UserController]
})
export class AdminUserModule {}
