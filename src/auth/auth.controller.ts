import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import {AuthService }  from './auth.service';
import { ValidSignUp, ValidLogin } from './Dto/auth.dto';


@Controller('auth')
export class AuthController {  
    
    constructor(private readonly authService: AuthService) { }  
    
    @Post('register')
    SignUp( 
     @Body() dto:ValidSignUp       
    ) {
        return this.authService.SignUp(dto);
    } 

    @Post('login')
    SignIn(
       @Body() dto:ValidLogin 
    ) {
        return this.authService.Login(dto);  
     }   
     
    @Get('profile')  
    UserProfile(
        @Request() req
     ){
         // console.log(req.user);
         return this.authService.GetProfile(req.user); 
     }  
    
}
