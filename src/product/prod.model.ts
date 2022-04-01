import * as mongoose from 'mongoose';
import {Profile } from '../auth/auth.model';

export const ProductSchema = new mongoose.Schema({
     title: { type: String, required: true },
     description: { type: String, required: true },
     url:{type:String},
     price:{type:Number,required:true}, 
     createdby: {type: mongoose.Schema.Types.ObjectId,ref: 'Profile' } 
},{timestamps:true})

export interface Product {
    _id: string;
    title: string;
    description: string;
    url: string;
    price: number;
    createdby: Profile,
    createdAt: Date,
    updatedAt:Date
}
