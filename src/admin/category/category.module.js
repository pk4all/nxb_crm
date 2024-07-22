var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FieldType, FieldTypeSchema } from "../../schemas/fieldtype.schema";
import { Category, CategorySchema } from "../../schemas/category.schema";
let CategoryModule = class CategoryModule {
};
CategoryModule = __decorate([
    Module({
        imports: [MongooseModule.forFeatureAsync([{
                    name: FieldType.name,
                    useFactory: () => {
                        const schema = FieldTypeSchema;
                        schema.pre('save', async function () {
                            if (this.name && this.isModified('name')) {
                                this.slug = this.name.toLowerCase()
                                    .trim()
                                    .replace(/[\s\W-]+/g, '-')
                                    .replace(/^-+|-+$/g, '');
                            }
                        });
                        return schema;
                    }
                }, {
                    name: Category.name,
                    useFactory: () => {
                        const schema = CategorySchema;
                        return schema;
                    }
                }
            ])],
        providers: [CategoryService],
        controllers: [CategoryController]
    })
], CategoryModule);
export { CategoryModule };
//# sourceMappingURL=category.module.js.map