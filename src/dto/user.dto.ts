import { Document } from 'mongoose';
import { IsEmail, IsString, IsNotEmpty,IsNumber } from 'class-validator';

export class UserDto {
    readonly name: string;
    readonly email: string;
    readonly phone: number;
    
}
