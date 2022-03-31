import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {JwtService } from '@nestjs/jwt';
import {ConfigService } from '@nestjs/config';
@Injectable()
export class LoggerMiddleware implements NestMiddleware{

    constructor(
        public jwtService: JwtService,
        private readonly configService:ConfigService
    ){ } 
      
    async use(req: Request, res: Response, next: NextFunction) {
          
            try{
            let headers: string = req.get('authorization').replace('Bearer', '').trim();
                
            if (!headers) {
                throw new UnauthorizedException('access denied !');     
            }
           let token = this.jwtService.verify(headers, { secret:this.configService.get('ACCESS_KEY')});  
            req.user = token.userid;  
            next();
        
            }catch (err) {
                throw new UnauthorizedException('This token is not valid.');     
            }         
    }

    



}
