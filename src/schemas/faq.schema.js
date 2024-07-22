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
let Faq = class Faq {
    id;
    question;
    answer;
    status;
    createdAt;
    updatedAt;
};
__decorate([
    Prop(),
    __metadata("design:type", String)
], Faq.prototype, "id", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], Faq.prototype, "question", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], Faq.prototype, "answer", void 0);
__decorate([
    Prop({ default: true }),
    __metadata("design:type", Boolean)
], Faq.prototype, "status", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Faq.prototype, "createdAt", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Faq.prototype, "updatedAt", void 0);
Faq = __decorate([
    Schema({ timestamps: true })
], Faq);
export { Faq };
export const FaqSchema = SchemaFactory.createForClass(Faq);
//# sourceMappingURL=faq.schema.js.map