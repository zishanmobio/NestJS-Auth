import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import {ProductService } from './prod.service';
import {CreateProd } from './dto/prod.dto';

@Controller('product')
export class ProductController{

    constructor(
       private readonly productService:ProductService
    ){}   
   
    @Post()     
    CreateProduct(
        @Request() req,
        @Body() dto:CreateProd 
    ) { 
         
        return this.productService.CreateProduct(req.user, dto); 
    }
     


}


