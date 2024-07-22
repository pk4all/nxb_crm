var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { Category, CategorySchema } from "../../schemas/category.schema";
import { FieldType, FieldTypeSchema } from "../../schemas/fieldtype.schema";
import { Form, FormSchema } from "../../schemas/form.schema";
let FormModule = class FormModule {
};
FormModule = __decorate([
    Module({
        imports: [
            MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
            MongooseModule.forFeature([{ name: FieldType.name, schema: FieldTypeSchema }]),
            MongooseModule.forFeature([{ name: Form.name, schema: FormSchema }])
        ],
        providers: [FormService],
        controllers: [FormController]
    })
], FormModule);
export { FormModule };
//# sourceMappingURL=form.module.js.map