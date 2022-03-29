import { Controller,Post,Body,Get, Param, UseGuards, Request} from '@nestjs/common';
import {AuthService }  from './auth.service';
import { DTO,SignInDTO } from './Dto/validate';
import { JwtAuthGuard } from './Protected/main'
import { Payload } from '../Type/main';

@Controller('auth')
    export class AuthController {  
    constructor(private readonly authService: AuthService){}  
    
    @Post('register')
    UserSignup(
      @Body() dto: DTO
    ) {
      return this.authService.SignUp(dto);  
     } 
     
     @Post('login')
     UserSignIn(@Body() signdto:SignInDTO) {
      return this.authService.SignIn(signdto);  
     }
     
     
     @Get('profile')    
     UserProfile(@Request() req) { 
       return this.authService.Profile(req.user);
     }   
  
}
