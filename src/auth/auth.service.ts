import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {InjectModel } from '@nestjs/mongoose';
import {Profile } from './auth.model';
import { Model } from 'mongoose'
import { DTO,SignInDTO } from './Dto/validate'; 
import * as bcrypt from 'bcrypt'
import {Payload,Constainst, Token} from '../Type/main';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('Profile')
        private readonly UserModel: Model<Profile>,
        private readonly jwtService:JwtService
     ) { } 
    
     async SignUp(dto:DTO) {
         try{   
         let hash: string=await bcrypt.hash(dto.password, 10); 
         let userProfile = new this.UserModel({
             name: dto.name,
             email: dto.email.toLowerCase(),
             password:hash,
             phone:dto.phone
         }) 
         
         await userProfile.save();
          
             return { msg: 'user register successfully...' };
         } catch (err) {
             if (err.code === 11000) {
                 throw new NotFoundException({message:'email already exists please login.'})
             }
             throw new NotFoundException(err); 
         }       
     } 
    async SignIn(dto:SignInDTO):Promise<Token> {
        try{   
         let user = await this.UserModel.findOne({ email: dto.email.toLowerCase()}).exec();  
         if (!user) throw new UnauthorizedException('access denied !');     
        
         let isMatch: boolean = await bcrypt.compare(dto.password,user.password);
         if (!isMatch) throw new UnauthorizedException('Incorrect Password');  
               
           let token:Token= await this.GetToken(user._id.toString(), user.email);              
          return token;
        } catch (err) {
            throw new NotFoundException(err); 
        }
      }  
     
    async Profile(email:string) {
         
        let user = await this.UserModel.findOne({ email: email }).exec();
        
        if (!user) throw new NotFoundException('no user exist');   
        
        return { name: user.name, email: user.email, phone: user.phone };       

    } 
     
    async GetToken(id:string,email:string) {
         
        let payload: Payload = {
            userid: id,
            email:email 
        }
         let token = await this.jwtService.sign(payload, { secret: Constainst.access_key, expiresIn: Constainst.expireTime }); 
        return { access_token: token };  
     }       
    
}
