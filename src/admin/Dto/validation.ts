import { IsEmail, IsString,MinLength } from 'class-validator';

export class ValidSignUp{

    @IsString()
    @MinLength(2, { message: 'username length is too short. please enter atleast 2' })
    username: string;
    
    @IsEmail()
    mail: string;
    
    @IsString()
    @MinLength(6, { message: 'password length too short.' })
    password: string;

    @IsString()
    @MinLength(4)    
    role: string; 


}

export class ValidLogin{
    
    @IsEmail()
    mail: string;
    
    @IsString()
    @MinLength(6, { message: 'password length too short.' })
    password: string;  

}



