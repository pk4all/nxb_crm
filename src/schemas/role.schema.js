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
import { Types } from 'mongoose';
let Role = class Role {
    id;
    name;
    permissions;
    status;
    createdAt;
    updatedAt;
};
__decorate([
    Prop(),
    __metadata("design:type", String)
], Role.prototype, "id", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    Prop({ type: Types.Array }),
    __metadata("design:type", Object)
], Role.prototype, "permissions", void 0);
__decorate([
    Prop({ default: true }),
    __metadata("design:type", Boolean)
], Role.prototype, "status", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Role.prototype, "createdAt", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Role.prototype, "updatedAt", void 0);
Role = __decorate([
    Schema({ timestamps: true })
], Role);
export { Role };
export const RoleSchema = SchemaFactory.createForClass(Role);
//# sourceMappingURL=role.schema.js.map