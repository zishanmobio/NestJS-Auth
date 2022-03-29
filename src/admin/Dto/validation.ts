import { IsEmail, IsString, Length, MinLength } from 'class-validator';

import {} from 'class-validator';

export class validAdmin{

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



