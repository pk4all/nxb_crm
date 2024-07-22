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
let Ads = class Ads {
    id;
    name;
    trackingCode;
    trackingCodeTablet;
    trackingCodeMobile;
    position;
    provider;
    page;
    status;
    createdAt;
    updatedAt;
};
__decorate([
    Prop(),
    __metadata("design:type", String)
], Ads.prototype, "id", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], Ads.prototype, "name", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Ads.prototype, "trackingCode", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Ads.prototype, "trackingCodeTablet", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Ads.prototype, "trackingCodeMobile", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Ads.prototype, "position", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Ads.prototype, "provider", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Ads.prototype, "page", void 0);
__decorate([
    Prop({ default: true }),
    __metadata("design:type", Boolean)
], Ads.prototype, "status", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Ads.prototype, "createdAt", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Ads.prototype, "updatedAt", void 0);
Ads = __decorate([
    Schema({ timestamps: true })
], Ads);
export { Ads };
export const AdsSchema = SchemaFactory.createForClass(Ads);
//# sourceMappingURL=ads.schema.js.map