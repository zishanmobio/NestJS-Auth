import { Controller, Post, Body, Get, Request,Put, Delete, Param } from '@nestjs/common';
import {AuthService }  from './auth.service';
import { ValidSignUp, ValidLogin,ValidUpdate } from './dto/auth.dto';


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
         return this.authService.GetProfile(req.user); 
     }  
    
    @Get('getseller')
    GetsellerList(
      @Request() req   
    ) {
        return this.authService.GetSellerProfile(req.user);  
      }
        
    @Put('active-seller/:id')
    ActiveSellerAccount(
        @Request() req,
        @Param('id') id,
    ) {
         
        return this.authService.ActiveSellerByAdmin(id, req.user);  
    }
    @Put('update')
    UpdateProfile(
        @Request() req,
        @Body() dto:ValidUpdate   
    ) {
        console.log(dto);
        return this.authService.UpdateProfile(req.user, dto); 
     } 
    
     
    

}
