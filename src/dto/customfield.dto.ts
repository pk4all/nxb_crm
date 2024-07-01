import { Document } from 'mongoose';
import { IsEmail, IsString, IsNotEmpty,IsNumber, IsBoolean, IsObject } from 'class-validator';

export class CustomFieldDto {
    @IsString()
    type: string;

    @IsString()
    fieldName: string;
    
    @IsBoolean()
    status:boolean;

    @IsBoolean()
    required:boolean;

    
}
