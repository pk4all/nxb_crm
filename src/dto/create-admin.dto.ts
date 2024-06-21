import { Document } from 'mongoose';
import { IsEmail, IsString, IsNotEmpty,IsNumber } from 'class-validator';

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNumber()
    @IsNotEmpty()
    phone: number;

    @IsString()
    password: string;
    
}
