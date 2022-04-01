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
        public readonly UserModel:Model<Profile>
    ){}
           
    async createProduct(id:string,dto:CreateProd ) {
         
        try{
        
            let seller = await this.UserModel.findById(id).exec();
            if (!seller) throw new BadRequestException('access denied !'); 
              
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
           
            return { title: result.title, description: result.description, price: result.price };
        
        } catch (err) {
            if (err.status===400)
                throw new BadRequestException();      
            
            throw new InternalServerErrorException(); 
          }
    }    
     
    async getProduct(userid:string) {
        
        try {
            let seller =await this.UserModel.findById(userid).populate('product').exec();  
             
            if(!seller) throw new BadRequestException(`access denied !`)
             
            return seller.product.map(prod =>
                {
                    return {
                        id: prod._id.toString(),
                        title: prod.title,
                        description: prod.description,
                        price: prod.price
                    }
                }); 

        } catch (err) {
            // console.log(err);
            if (err.status===400)
                throw new BadRequestException();      
            
            throw new InternalServerErrorException();
         }
    
    }
     
    async  getProductById(userid:string,id:string) {
        
        try{
                 
            let seller = await this.UserModel.findById(userid).populate('product').exec();
            
            if (!seller) throw new BadRequestException('access denied !');
             
            let product = seller.product.find(prod => prod._id.toString() === id);          
                      
            return {
                id: product._id,
                title: product.title,
                description: product.description,
                price: product.price,
                createdAt: product.createdAt
               } 
        } catch (err) {
            console.log(err);    
            if (err.status===400)
                throw new BadRequestException();      
            
            throw new InternalServerErrorException();
            
        }
     }    
    
     async updateProductById(userid:string,id:string,dto:CreateProd) {
         
         try {
               
             let seller = await this.UserModel.findById(userid).exec();
             
             if (!seller) throw new BadRequestException('access denied !');
             
             let updateProd = await this.productModel.updateOne({_id:id},{$set:{title:dto.title,description:dto.description,price:dto.price}});   
               
             return {msg:updateProd.modifiedCount===1 ? `product updated succesfully...` : `product doesn't updated !` }  
              
         } catch (err) {
             console.log(err);    
             if(err.status === 400)
                throw new BadRequestException();      
            
             throw new InternalServerErrorException();
          }
      }    
     
    
    
      async deleteProduct(userid:string,id:string) {
         
         try {
               
             let seller = await this.UserModel.findById(userid).exec();
             
             if (!seller) throw new BadRequestException('access denied !');
             
             let deleteProd = await this.productModel.deleteOne({_id:id})   
                    
             let updateList = seller.product.filter(prod => prod._id.toString() !== id);       
             console.log("Update List  :",updateList);
             seller.product = updateList;
             await seller.save();

             return {msg:deleteProd.deletedCount===1 ? `product deleted succesfully...` : `product doesn't deleted !` }  
              
         } catch (err) {
             console.log(err);    
             if(err.status === 400)
                throw new BadRequestException();      
            
             throw new InternalServerErrorException();
          }
      }     

    
}