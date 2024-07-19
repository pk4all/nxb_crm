import { Document } from 'mongoose';
import { IsEmail, IsString, IsNotEmpty,IsNumber, IsBoolean } from 'class-validator';

export class CreateUserDto {
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
    
    @IsBoolean()
    newslatterSubscribe:boolean;
    @IsBoolean()
    tnc:boolean;
}
