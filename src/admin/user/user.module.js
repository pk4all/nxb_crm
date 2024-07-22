var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Admin, AdminSchema } from '../../schemas/admin.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionSchema, Permission } from "../../schemas/permission.schema";
import { Role, RoleSchema } from "../../schemas/role.schema";
let AdminUserModule = class AdminUserModule {
};
AdminUserModule = __decorate([
    Module({
        imports: [MongooseModule.forFeature([
                { name: Admin.name, schema: AdminSchema },
                { name: Permission.name, schema: PermissionSchema },
                { name: Role.name, schema: RoleSchema }
            ])],
        providers: [UserService],
        controllers: [UserController]
    })
], AdminUserModule);
export { AdminUserModule };
//# sourceMappingURL=user.module.js.map