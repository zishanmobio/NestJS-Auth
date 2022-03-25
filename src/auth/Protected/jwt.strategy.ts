import {ExtractJwt,Strategy } from 'passport-jwt';
import {PassportStrategy } from '@nestjs/passport';
import { Injectable  } from '@nestjs/common';
import { Payload } from '../Type/Payload.type';
import { Constainst } from '../Type/constaint';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
      
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,  
            secretOrKey:Constainst.access_key
       }) 
    }
       
    async validate(payload:Payload) {
       return {
            userid: payload.userid,
            email: payload.email
        }   
     }   

}