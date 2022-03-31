import { Injectable,UnauthorizedException,BadRequestException, InternalServerErrorException } from '@nestjs/common';
import {InjectModel } from '@nestjs/mongoose';
import {Profile } from './auth.model';
import { Model } from 'mongoose'
import { ValidLogin,ValidSignUp,ValidUpdate } from './dto/auth.dto'; 
import * as bcrypt from 'bcrypt'
import {Payload,Constainst, Token} from '../common/types/main';
import { JwtService } from '@nestjs/jwt';
import {ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel('Profile')
        private readonly UserProfile: Model<Profile>,
        private readonly jwtService: JwtService,
        private configService:ConfigService
     ) { } 

    async SignUp(dto:ValidSignUp) {
        try {
         
              let isexist = await this.UserProfile.findOne({ role: { $eq: 'admin' } }).exec();
             
              if(isexist) throw new BadRequestException({ message: 'please choose user or seller option to signup account.' });
                   
              let created = await this.creatUser(dto.role, dto);
                    
              return { username: created.username, mail: created.mail, role: created.role, active: created.active }; 
        
        } catch (err) {
            // console.log(err);
            if (err.code === 11000) {
                throw new BadRequestException({statusCode:400,message:'email already exists. please login'}) 
            }else if (err.status === 400) {
                throw new BadRequestException(err.response.message); 
            }else 
               throw new InternalServerErrorException()  
        } 
    }  
            
    async Login(dto:ValidLogin) {
           
        let isexist = await this.UserProfile.findOne({ mail: dto.mail.toLowerCase() }).exec(); 
         
        if(!isexist) throw new BadRequestException({message:'access denied !'}) 
                
        let isMatch: boolean = await bcrypt.compare(dto.password, isexist.password);  
         console.log(isMatch," ",isexist.active)
        if(!isMatch || !isexist.active ) throw new BadRequestException({ message: 'Incorrect Password/ user inactive'}); 
         
        let token =await  this.SignInTokens(isexist.id, isexist.mail);          
                   
        return token;

     }    

    async GetProfile(id:string) {
        
        let isexist = await this.UserProfile.findOne({ _id:id});     
          
        if (!isexist) throw new BadRequestException('access denied !');
         
        return { username: isexist.username, email: isexist.mail, role: isexist.role };    
         
    }
       
    async GetSellerProfile(id:string) {
         
        let isexist = await this.UserProfile.findById(id).exec();   
         
        if(!isexist) throw new BadRequestException('access denied. !') 
          
        let seller = await this.UserProfile.find({ role: 'seller' }).sort({createdAt:-1}).exec();    
         
        return seller.map(sel =>{ return {username:sel.username,mail:sel.mail,active:sel.active} })

     }    
      
    async ActiveSellerByAdmin(id: string, userid: string) {
        
        try {
             
         let admin=await this.UserProfile.findOne({_id:userid,role:'admin'})
          
         if (!admin) throw new UnauthorizedException('access denied!');
           
         let update = await this.UserProfile.updateOne({ _id: id}, { $set: { active: true } });  
          
          return {
            id: id,
            msg:update.modifiedCount===1 ? `seller account activated...` : `seller account doesn't activated`
          }
         }catch (err) {
            throw new InternalServerErrorException();    
        }
           
      }  
     
    async UpdateProfile(userid:string,dto:ValidUpdate) {
              
        try {
               
         let isexist = await this.UserProfile.findOne({_id:userid})  
            
         if(!isexist) throw new BadRequestException('unauthorized user not allowed!');  
       
        let update = await this.UserProfile.updateOne({_id:userid }, { $set: { mail: dto.mail.toLowerCase(), username: dto.username } });  
                
          return {
            id: isexist.username,
            msg:update.modifiedCount===1 ? `user profile updated...` : `user profile doesn't updated !`
          }
        } catch (err) {
            
            if (err) {
                if(err.code===11000)
                   throw new BadRequestException({message:'email is already taken. please choose other one.'})
                
                throw new BadRequestException();
            }
            throw new InternalServerErrorException();                
         }
     }
    
    
    
    /* Utility Function  */ 
     
    async SignInTokens(id: string, email: string) {
           
        let payload: Payload = {
            userid: id,
            email:email
         }
            
        let token = await this.jwtService.sign(payload, { secret:this.configService.get('ACCESS_KEY'), expiresIn: Constainst.expireTime });
        return { access_token: token };     
     }
      
    async creatUser(role: string, dto: ValidSignUp) {
        let hash: string = await bcrypt.hash(dto.password, 10);   
        // console.log(dto.mail);
         let createAdmin = new this.UserProfile({
             username: dto.username,
             mail: dto.mail.toLowerCase(),
             role: role,
             active:role === 'seller' ? false : true,
             password:hash
          })
         return await createAdmin.save();            
          
     }  
 
              
    
}
