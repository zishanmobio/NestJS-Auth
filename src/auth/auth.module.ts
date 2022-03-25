import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import {MongooseModule} from '@nestjs/mongoose'
import { UserProfile } from './auth.model';
import {JwtModule } from '@nestjs/jwt';
import {PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './Protected/jwt.strategy';
import { LoggerMiddleware } from './Middleware/middleware';
import { AuthController } from './auth.controller';

@Module({
  imports: [
     JwtModule.register({}),
     PassportModule,
     MongooseModule.forFeature([{name:'Profile',schema:UserProfile}]) 
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy]
  
})

export class AuthModule implements NestModule{ 
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware)
        .exclude(
          { path: 'auth/register', method: RequestMethod.POST },
          { path: 'auth/login', method: RequestMethod.POST }
          )
        .forRoutes(AuthController);
    }

}