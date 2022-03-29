import { BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';

import { Model } from 'mongoose';
import {InjectModel } from '@nestjs/mongoose';
import {Admin } from './admin.model';
import { ValidSignUp, ValidLogin } from './Dto/validation'; 
import  * as bcrypt from 'bcrypt'
import {Payload,Token,Constainst} from '../Type/main';
import {JwtService} from '@nestjs/jwt'

@Injectable()
export class AdminService {
  
    constructor(
        @InjectModel('Admin')
        private readonly AdminModel: Model<Admin>,
        private readonly jwtService:JwtService
    ){}
     
    async SignUp(dto:ValidSignUp) {
        try {
         
         let createAdmin; 
         let hash: string = await bcrypt.hash(dto.password, 10);   
            
         if(dto.role==='admin') {
          
            let isexist = await this.AdminModel.findOne({role:{$eq:'admin'}}).exec();  
            
            if (isexist)
               throw  new BadRequestException({ message: 'please choose user or seller option to signup account.' });
            
            createAdmin = new this.AdminModel({
                username: dto.username,
                mail: dto.mail.toLowerCase(),
                password: hash
            }) 
                    
        } else if (dto.role==='user') {
              
            createAdmin = new this.AdminModel({
                username: dto.username,
                mail: dto.mail.toLowerCase(),
                password: hash,
                role: dto.role,
                active:false
            })
        } else {

            createAdmin = new this.AdminModel({
                username: dto.username,
                mail: dto.mail.toLowerCase(),
                password: hash,
                role: dto.role,
                active:false
            })
        }
        
        let admin = await createAdmin.save();
        return { username: admin.username, mail: admin.mail, role: admin.role, active: admin.active }; 
        
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
           
        let isexist = await this.AdminModel.findOne({ mail: dto.mail.toLowerCase() }).exec(); 
         
        if(!isexist) throw new BadRequestException({message:'access denied !'}) 
                
        let isMatch: boolean = await bcrypt.compare(dto.password, isexist.password);  
         console.log(isMatch," ",isexist.active)
        if(!isMatch || !isexist.active ) throw new BadRequestException({ message: 'Incorrect Password/ user inactive'}); 
         
        let token =await  this.GetTokens(isexist.id, isexist.mail);          
                   
        return token;

     }    

     
    async GetTokens(id:string,email:string) {
           
        let payload: Payload = {
            userid: id,
            email:email
         }
            
        let token = await this.jwtService.sign(payload, { secret: Constainst.access_key, expiresIn: Constainst.expireTime });
        return { access_token: token };     
     }


}







