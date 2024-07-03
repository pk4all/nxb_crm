import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Admin, AdminSchema } from '../../schemas/admin.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionSchema,Permission } from 'src/schemas/permission.schema';
import { Role,RoleSchema } from 'src/schemas/role.schema';
@Module({
  imports:[MongooseModule.forFeature([
    {name:Admin.name,schema:AdminSchema},
    {name:Permission.name,schema:PermissionSchema},
    {name:Role.name,schema:RoleSchema}
  ])],
  providers: [UserService],
  controllers: [UserController]
})
export class AdminUserModule {}
