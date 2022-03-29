import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import {AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    AuthModule, 
    AdminModule,
    MongooseModule.forRoot('mongodb://localhost:27017/AuthDB')
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
