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
let FieldType = class FieldType {
    id;
    name;
    type;
    slug;
    status;
    createdAt;
    updatedAt;
    createdBy;
    updatedBy;
};
__decorate([
    Prop(),
    __metadata("design:type", String)
], FieldType.prototype, "id", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], FieldType.prototype, "name", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], FieldType.prototype, "type", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], FieldType.prototype, "slug", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Boolean)
], FieldType.prototype, "status", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], FieldType.prototype, "createdAt", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], FieldType.prototype, "updatedAt", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], FieldType.prototype, "createdBy", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], FieldType.prototype, "updatedBy", void 0);
FieldType = __decorate([
    Schema({ timestamps: true })
], FieldType);
export { FieldType };
export const FieldTypeSchema = SchemaFactory.createForClass(FieldType);
//Wizcad#2024
//wizcad
//# sourceMappingURL=fieldtype.schema.js.map