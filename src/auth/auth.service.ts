import { Injectable, NotFoundException, UnauthorizedException,BadRequestException, InternalServerErrorException } from '@nestjs/common';
import {InjectModel } from '@nestjs/mongoose';
import {Profile } from './auth.model';
import { Model } from 'mongoose'
import { ValidLogin,ValidSignUp } from './Dto/auth.dto'; 
import * as bcrypt from 'bcrypt'
import {Payload,Constainst, Token} from '../Common/Type/main';
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
         
         let created; 
                     
            if(dto.role === 'admin') {
          
                let isexist = await this.UserProfile.findOne({ role: { $eq: 'admin' } }).exec();
            
                if (isexist)
                    throw new BadRequestException({ message: 'please choose user or seller option to signup account.' });
                   
                created = await this.CreateRoleOfUser(dto.role, dto);
                    
             } else if (dto.role === 'user')
                created = await this.CreateRoleOfUser(dto.role, dto);
             else
                created = await this.CreateRoleOfUser(dto.role, dto);
             
             
            return { username:created.username, mail:created.mail, role:created.role, active:created.active }; 
        
        } catch (err) {
            // console.log(err);
            if (err.code === 11000) {
                throw new BadRequestException({statusCode:400,message:'email already exists. please login'}) 
            } else if(err.status === 400) {
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
         
        let token =await  this.GetTokens(isexist.id, isexist.mail);          
                   
        return token;

     }    

    async GetProfile(email:string) {
        
        let isexist = await this.UserProfile.findOne({ mail: email.toLowerCase() });     
          
        if (!isexist) throw new BadRequestException('access denied !');
         
        return { username: isexist.username, email: isexist.mail, role: isexist.role };    
         
    }
     
    
    
    
    
    
    
    
    
    async GetTokens(id:string,email:string) {
           
        let payload: Payload = {
            userid: id,
            email:email
         }
            
        let token = await this.jwtService.sign(payload, { secret:this.configService.get('ACCESS_KEY'), expiresIn: Constainst.expireTime });
        return { access_token: token };     
     }
      
   
    async CreateRoleOfUser(role: string, dto: ValidSignUp) {
        
        let createAdmin;
        switch (role) {
            case 'user':
                createAdmin = await this.creatUser(role, dto);
                break;  
            case 'seller':
                createAdmin = await this.creatUser(role, dto);
                break;
            default:
                createAdmin = await this.creatUser(role, dto);     
             
        }
        return createAdmin;
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
