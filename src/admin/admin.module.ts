import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminProfile } from './admin.model';
import {JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    JwtModule.register({}),
   MongooseModule.forFeature([{name:'Admin',schema: AdminProfile}])
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
  
export class AdminModule {}
