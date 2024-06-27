import { Document } from 'mongoose';
import { IsEmail, IsString, IsNotEmpty,IsNumber } from 'class-validator';

export class CreateListingTypeDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
}
