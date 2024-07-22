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
let Form = class Form {
    id;
    title;
    // @Prop({ref: 'Category'})
    // type: string;
    category;
    typeName;
    description;
    profileImage;
    coverImage;
    status;
    visibility;
    icon;
    fields;
    createdAt;
    updatedAt;
};
__decorate([
    Prop(),
    __metadata("design:type", String)
], Form.prototype, "id", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Form.prototype, "title", void 0);
__decorate([
    Prop({ ref: 'Category' }),
    __metadata("design:type", String)
], Form.prototype, "category", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Form.prototype, "typeName", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Form.prototype, "description", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Form.prototype, "profileImage", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Form.prototype, "coverImage", void 0);
__decorate([
    Prop({ default: true }),
    __metadata("design:type", Boolean)
], Form.prototype, "status", void 0);
__decorate([
    Prop({ default: 'public' }),
    __metadata("design:type", String)
], Form.prototype, "visibility", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Form.prototype, "icon", void 0);
__decorate([
    Prop({ type: Types.Array }),
    __metadata("design:type", Object)
], Form.prototype, "fields", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Form.prototype, "createdAt", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Form.prototype, "updatedAt", void 0);
Form = __decorate([
    Schema({ timestamps: true })
], Form);
export { Form };
export const FormSchema = SchemaFactory.createForClass(Form);
//# sourceMappingURL=form.schema.js.map