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
import { SEOSchema } from './seo.schema';
let Page = class Page {
    id;
    title;
    slug;
    icon;
    image;
    description;
    seo;
    status;
    createdAt;
    updatedAt;
};
__decorate([
    Prop(),
    __metadata("design:type", String)
], Page.prototype, "id", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Page.prototype, "title", void 0);
__decorate([
    Prop({ required: true, unique: true }),
    __metadata("design:type", String)
], Page.prototype, "slug", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Page.prototype, "icon", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Page.prototype, "image", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Page.prototype, "description", void 0);
__decorate([
    Prop({ type: SEOSchema }),
    __metadata("design:type", Object)
], Page.prototype, "seo", void 0);
__decorate([
    Prop({ default: true }),
    __metadata("design:type", Boolean)
], Page.prototype, "status", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Page.prototype, "createdAt", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Page.prototype, "updatedAt", void 0);
Page = __decorate([
    Schema({ timestamps: true })
], Page);
export { Page };
export const PageSchema = SchemaFactory.createForClass(Page);
//# sourceMappingURL=page.schema.js.map