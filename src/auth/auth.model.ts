import * as mongoose from 'mongoose';
import {Product } from '../product/prod.model';
export const UserProfile = new mongoose.Schema({
    username: {
        type: String, required: true
    },
    mail: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true
    },
    role: {
        type: String,
        enum: ['admin','user','seller'],
        default:'admin'
    },
    active: {
        type: Boolean,
        default: true
    },
    product: [{
        type:mongoose.Schema.Types.ObjectId,ref:'Product' 
    }]
},{timestamps:true})

export interface Profile {
      username: string,
      mail: string,
      password: string,
      role:string,
      active: boolean;
      product:Product[]
}
