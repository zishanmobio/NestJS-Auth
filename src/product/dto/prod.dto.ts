import {IsNumber, IsString,MinLength } from 'class-validator';


export class CreateProd{
    
    @IsString()
    @MinLength(2,{message:'title length too small please choose atleast 2'})
    title: string;
 
    @IsString()
    @MinLength(6, { message: 'please choose atleast 6 length of description.' })
    description: string;
    
    @IsNumber()
    price:number

}
