import { Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common';
import {ProductService } from './prod.service';
import {CreateProd } from './dto/prod.dto';

@Controller('product')
export class ProductController{

    constructor(
       private readonly productService:ProductService
    ){}   
    
    // Create Product By Seller role
    //post:request==> /product/ 
    @Post()     
    createProduct(
        @Request() req,
        @Body() dto:CreateProd 
    ) { 
        return this.productService.createProduct(req.user, dto); 
    }
     
    // Get All Product By Seller
    // get:request==> /product/ 

    @Get()
    getProduct(
      @Request() req  
    ) {
             
        return this.productService.getProduct(req.user);   
         
      } 
    
    // Get Product By Id
    // get:request==> /product/:id 
    @Get(':id')
    getProductById(
        @Param('id') id,
        @Request() req
    ){
        // console.log(req.user, " ", id);       
        return this.productService.getProductById(req.user, id); 
    }
    // product update By Seller Role
    // put:request==>/product/:id  
    @Put(':id')
    updateProduct(
        @Param('id') id,
        @Request() req,
        @Body() dto:CreateProd
    ) {
         return this.productService.updateProductById(req.user, id, dto);
    }
    // product delete By Seller Role
    //delete:request==> /product/:id
    @Delete(':id')
    deleteProduct(
        @Param('id') id,
        @Request() req 
     ) {
       
        return this.productService.deleteProduct(req.user, id);  
    }
    
  
     

}


