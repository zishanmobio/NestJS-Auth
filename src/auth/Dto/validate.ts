import {IsString,IsEmail, MinLength,MaxLength} from 'class-validator';

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


