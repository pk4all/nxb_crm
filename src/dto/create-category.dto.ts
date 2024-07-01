import { Document } from 'mongoose';
import { IsEmail, IsString, IsNotEmpty,IsNumber, IsBoolean, IsObject } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    parentId: string;

    @IsString()
    parentName: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    icon: string;

    @IsString()
    image: string;

    @IsString()
    description: string;

    @IsString()
    typeId: string;

    @IsString()
    typeName: string;

    @IsBoolean()
    hideDescription:boolean;

    @IsObject()
    customFields:object;

    @IsObject()
    seo:object;

    @IsBoolean()
    status:boolean;

    @IsBoolean()
    dedicateForPermanentListings:boolean;

    @IsBoolean()
    childrenStatus:boolean;

    
}
