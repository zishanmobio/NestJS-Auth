import * as mongoose from 'mongoose';

export const  UserProfile= new mongoose.Schema({
    name: {
        type: String, required: true
    },
    email: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true
    },
    phone: {
        type:Number, required: true, unique: true
    }
})

export interface Profile {
      name: string,
      email: string,
      password: string,
      phone: number
}

