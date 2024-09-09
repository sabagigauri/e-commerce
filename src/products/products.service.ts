import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { User, UserDocument } from '../users/user.schema'; 
import { UsersService } from '../users/users.service'; 

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
  ) {}

  async addProductsFromAPI(): Promise<Product[]> {
    const response = await lastValueFrom(
      this.httpService.get('https://fakestoreapi.com/products'),
    );

    const products = response.data;

    const insertedProducts = await this.productModel.insertMany(products);

    return insertedProducts.map((product) => product.toObject());
  }

  async searchProducts(
    keyword: string,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<Product[]> {
    const query = {
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ],
    };

    const sortOption: { [key: string]: 'asc' | 'desc' } = sortBy
      ? { [sortBy]: sortOrder }
      : {};

    return this.productModel.find(query).sort(sortOption).exec();
  }

  async updateProduct(
    id: string,
    updateProductDto: any,
    userId: string,
  ): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const user = await this.usersService.findById(userId);
    if (!user || !user.isAdmin) {
      throw new ForbiddenException(
        'You do not have permission to update this product',
      );
    }

    Object.assign(product, updateProductDto);
    return product.save();
  }

  async deleteProduct(id: string, userId: string): Promise<void> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.isAdmin) {
      throw new ForbiddenException(
        'You do not have permission to delete this product',
      );
    }

    const result = await this.productModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Product not found');
    }
  }

  async deactivateProduct(id: string, user: UserDocument): Promise<Product> {
    if (!user.isAdmin) {
      throw new ForbiddenException('Only admins can deactivate products');
    }

    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.isActive = false;
    return product.save();
  }

 
  async activateProduct(id: string, user: UserDocument): Promise<Product> {
    if (!user.isAdmin) {
      throw new ForbiddenException('Only admins can activate products');
    }

    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.isActive = true;
    return product.save();
  }
}
