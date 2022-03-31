import { MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose'
import {JwtModule } from '@nestjs/jwt';
import { LoggerMiddleware } from '../common/middleware/middleware';
import {ProductSchema } from './prod.model';
import {ProductController } from './prod.controller';
import {ProductService } from './prod.service';
// import {UserProfile } from '../auth/auth.model';
import {AuthModule } from '../auth/auth.module';
@Module({
  imports: [
        JwtModule.register({}),
        MongooseModule.forFeature([
            { name: 'Product', schema: ProductSchema }
        ]),
        AuthModule
    ],
  controllers: [ProductController],
  providers: [ProductService]
  
})

export class ProdModule  implements NestModule{ 
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).
            forRoutes(ProductController);
    }

}