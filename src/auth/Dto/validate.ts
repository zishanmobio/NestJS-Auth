import {IsString,IsNumber,Length, IsEmail, MinLength, minLength, IsPhoneNumber, IsMobilePhone, MaxLength, IS_LENGTH, length, isMobilePhone, min, max, Min, Max, isLowercase } from 'class-validator';
import { Interface } from 'readline';

export class DTO{
    @IsString() 
    name: string;
    
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(6)
    password: string;
    
    @MinLength(10,{message:'please enter valid mobile number.'})
    @MaxLength(10,{message:'please enter valid mobile number.'})    
    phone:number

}

export class SignInDTO{
    @IsEmail()
    email: string;
     
    @IsString()
    @MinLength(6)    
    password: string;

}


