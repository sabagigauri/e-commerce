import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; 
import { UsersModule } from './users/users.module'; 
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://sabagigauri:<db_password>@cluster0.u8vp7.mongodb.net/',
    ), 
    UsersModule,
    ProductsModule,
  ],
})
export class AppModule {}
