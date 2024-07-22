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
let Permission = class Permission {
    path;
    name;
    slug;
    method;
    status;
    createdAt;
    updatedAt;
};
__decorate([
    Prop(),
    __metadata("design:type", String)
], Permission.prototype, "path", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Permission.prototype, "name", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Permission.prototype, "slug", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Permission.prototype, "method", void 0);
__decorate([
    Prop({ default: true }),
    __metadata("design:type", Boolean)
], Permission.prototype, "status", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Permission.prototype, "createdAt", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Permission.prototype, "updatedAt", void 0);
Permission = __decorate([
    Schema({ timestamps: true })
], Permission);
export { Permission };
export const PermissionSchema = SchemaFactory.createForClass(Permission);
//# sourceMappingURL=permission.schema.js.map