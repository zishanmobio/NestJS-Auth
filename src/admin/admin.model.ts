import * as mongoose from 'mongoose';

export const AdminProfile = new mongoose.Schema({
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
        default:true
    }
},{timestamps:true})

export interface Admin {
      username: string,
      mail: string,
      password: string,
      role:string,
      active:boolean
}
