import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import {AuthModule } from './auth/auth.module';
@Module({
  imports: [
   AuthModule, 
   MongooseModule.forRoot('mongodb://localhost:27017/AuthDB')
   ],
  controllers: [],
  providers: [],
})
export class AppModule {}
