var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { Admin, AdminSchema } from '../schemas/admin.schema';
import * as bcrypt from 'bcrypt';
// import { JwtAuthGuard } from './auth.guard';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    Module({
        imports: [MongooseModule.forFeatureAsync([
                { name: Admin.name,
                    useFactory: () => {
                        const schema = AdminSchema;
                        schema.pre('save', async function () {
                            const saltOrRounds = 10;
                            if (this.password && this.isModified('password')) {
                                this.password = await bcrypt.hash(this.password, saltOrRounds);
                                //const isMatch = await bcrypt.compare(password, hash);
                            }
                        });
                        return schema;
                    }
                },
                { name: Admin.name,
                    useFactory: () => {
                        const schema = AdminSchema;
                        schema.pre('findOneAndUpdate', async function (next) {
                            const saltOrRounds = 10;
                            // if (this.password && this.isModified('password')) {
                            //   this.password = await bcrypt.hash(this.password, saltOrRounds);
                            //   //const isMatch = await bcrypt.compare(password, hash);
                            // }
                            const password = this.get('password');
                            if (password) {
                                this.set({ password: await bcrypt.hash(password, saltOrRounds) });
                            }
                            next();
                        });
                        return schema;
                    }
                },
            ]),
            MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
            JwtModule.register({
                //global: true,
                secret: jwtConstants.secret,
                signOptions: { expiresIn: '600000s' },
            }),
            PassportModule
        ],
        controllers: [AuthController],
        providers: [
            AuthService,
            // {
            //   provide: APP_GUARD,
            //   useClass: AuthGuard,
            // },
            LocalStrategy,
            JwtStrategy
        ],
        exports: [AuthService],
    })
], AuthModule);
export { AuthModule };
// {
//   "name":"hello",
//   "phone":"1234567890",
//   "email":"hello@hello.com",
//   "password":"hello@123"
// }
//# sourceMappingURL=auth.module.js.map