var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
const timeZone = [];
let Admin = class Admin extends Document {
    role;
    roleName;
    name;
    // @Prop()
    // profileImage: string;
    email;
    phone;
    password;
    // @Prop()
    // dob:string;
    token;
    status;
    timeZone;
    createdAt;
    updatedAt;
};
__decorate([
    Prop({ ref: 'Role' }),
    __metadata("design:type", String)
], Admin.prototype, "role", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Admin.prototype, "roleName", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Admin.prototype, "name", void 0);
__decorate([
    Prop({ required: true, unique: true }),
    __metadata("design:type", String)
], Admin.prototype, "email", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Number)
], Admin.prototype, "phone", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Admin.prototype, "password", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Admin.prototype, "token", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Boolean)
], Admin.prototype, "status", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Admin.prototype, "timeZone", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Admin.prototype, "createdAt", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Admin.prototype, "updatedAt", void 0);
Admin = __decorate([
    Schema({ timestamps: true })
], Admin);
export { Admin };
export const AdminSchema = SchemaFactory.createForClass(Admin);
AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        if (this.password && this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
AdminSchema.pre('findOneAndUpdate', async function (next) {
    const saltOrRounds = 10;
    const password = this.get('password');
    if (password) {
        this.set({ password: await bcrypt.hash(password, saltOrRounds) });
    }
    next();
});
//# sourceMappingURL=admin.schema.js.map