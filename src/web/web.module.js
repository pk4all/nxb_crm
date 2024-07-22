var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { WebService } from './web.service';
import { WebController } from './web.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from "../schemas/category.schema";
import { FieldType, FieldTypeSchema } from "../schemas/fieldtype.schema";
import { Form, FormSchema } from "../schemas/form.schema";
let WebModule = class WebModule {
};
WebModule = __decorate([
    Module({
        imports: [
            MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
            MongooseModule.forFeature([{ name: FieldType.name, schema: FieldTypeSchema }]),
            MongooseModule.forFeature([{ name: Form.name, schema: FormSchema }])
        ],
        providers: [WebService],
        controllers: [WebController]
    })
], WebModule);
export { WebModule };
//# sourceMappingURL=web.module.js.map