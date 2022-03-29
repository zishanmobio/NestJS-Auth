import { Body, Controller,Post,Get,Request } from '@nestjs/common';
import {ValidSignUp,ValidLogin } from './Dto/validation';
import {AdminService } from './admin.service';

@Controller('admin')
export class AdminController {

    constructor(private readonly adminService:AdminService){}    
 
    @Post('register')
    SignUp( 
     @Body() dto:ValidSignUp       
    ) {
        return this.adminService.SignUp(dto);
    } 
    @Post('login')
    SignIn(
       @Body() dto:ValidLogin 
    ) {
        return this.adminService.Login(dto);  
    }        

       
}
