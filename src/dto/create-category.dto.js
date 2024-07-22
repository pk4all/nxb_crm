var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, IsBoolean, IsObject } from 'class-validator';
export class CreateCategoryDto {
    name;
    parentId;
    parentName;
    slug;
    icon;
    image;
    description;
    typeId;
    typeName;
    hideDescription;
    customFields;
    seo;
    status;
    dedicateForPermanentListings;
    childrenStatus;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "name", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "parentId", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "parentName", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "slug", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "icon", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "image", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "description", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "typeId", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "typeName", void 0);
__decorate([
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateCategoryDto.prototype, "hideDescription", void 0);
__decorate([
    IsObject(),
    __metadata("design:type", Object)
], CreateCategoryDto.prototype, "customFields", void 0);
__decorate([
    IsObject(),
    __metadata("design:type", Object)
], CreateCategoryDto.prototype, "seo", void 0);
__decorate([
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateCategoryDto.prototype, "status", void 0);
__decorate([
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateCategoryDto.prototype, "dedicateForPermanentListings", void 0);
__decorate([
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateCategoryDto.prototype, "childrenStatus", void 0);
//# sourceMappingURL=create-category.dto.js.map