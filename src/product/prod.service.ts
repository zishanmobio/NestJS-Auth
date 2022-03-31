import { Injectable,UnauthorizedException,BadRequestException, InternalServerErrorException } from '@nestjs/common';
import {InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import {Product } from './prod.model';
import {Profile } from '../auth/auth.model';
import {CreateProd} from './dto/prod.dto'

@Injectable()
export class ProductService{
    
    constructor(
        @InjectModel('Product')
        public readonly productModel: Model<Product>,
        @InjectModel('Profile')
        public readonly UserProfile:Model<Profile>
    ){}
           
    async CreateProduct(id:string,dto:CreateProd ) {
         
        try{
        let seller = await this.UserProfile.findById(id).exec();
        if (!seller) throw new BadRequestException('access denied !'); 
        //  console.log(seller);  
        let {title,description,price} = dto;
        let create = new this.productModel({
            title: title,
            description: description,
            price: price,
            createdby:seller
        });
           
        let result = await create.save();    
        seller.product.push(result);
        await seller.save();
        //    return {msg:'created product..'}
        return { title: result.title, description: result.description, price: result.price };
        } catch (err) {
            if (err.status)
                throw new BadRequestException();      
            
            throw new InternalServerErrorException(); 
          }
    }    
     


}