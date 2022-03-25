import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import {JwtService } from '@nestjs/jwt';
import { Constainst } from '../Type/constaint';


@Injectable()
export class LoggerMiddleware implements NestMiddleware{

    constructor(
       public jwtService:JwtService  
    ) { } 
    
      async use(req:Request,res:Response,next:NextFunction) {
            try{
            let headers: string = req.get('authorization').replace('Bearer', '').trim();
            
            if (!headers) {
                throw new UnauthorizedException('access denied !');     
            }
           let token = this.jwtService.verify(headers, { secret: Constainst.access_key });  
            req.user = token.email;  
            next();
        
            }catch (err) {
                throw new UnauthorizedException('This token is not valid.');     
            }         
    }   
}
