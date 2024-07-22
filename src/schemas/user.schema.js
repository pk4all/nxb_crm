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
let User = class User extends Document {
    id;
    name;
    profileImage;
    email;
    phone;
    password;
    tnc;
    newslatterSubscribe;
    token;
    createdAt;
    updatedAt;
};
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "profileImage", void 0);
__decorate([
    Prop({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Number)
], User.prototype, "phone", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    Prop({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "tnc", void 0);
__decorate([
    Prop({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "newslatterSubscribe", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], User.prototype, "token", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
User = __decorate([
    Schema({ timestamps: true })
], User);
export { User };
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', async function (next) {
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
UserSchema.pre('findOneAndUpdate', async function (next) {
    const saltOrRounds = 10;
    const password = this.get('password');
    if (password) {
        this.set({ password: await bcrypt.hash(password, saltOrRounds) });
    }
    next();
});
//# sourceMappingURL=user.schema.js.map