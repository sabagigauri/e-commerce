import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './cart.schema';
import { Product, ProductDocument } from 'src/products/product.schema';


@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async addToCart(userId: string, productId: string): Promise<Cart> {
    let cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      cart = new this.cartModel({ user: userId, products: [], quantities: [] });
    }

    const product = await this.productModel.findById(
      new Types.ObjectId(productId),
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const productIndex = cart.products.findIndex(
      (p: Types.ObjectId) => p.toString() === productId,
    );

    if (productIndex >= 0) {
      cart.quantities[productIndex]++;
    } else {
      cart.products.push(new Types.ObjectId(product._id)); 
      cart.quantities.push(1);
    }

    return cart.save();
  }

  async removeFromCart(userId: string, productId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const productIndex = cart.products.findIndex(
      (p: Types.ObjectId) => p.toString() === productId,
    );

    if (productIndex >= 0) {
      cart.quantities[productIndex]--;
      if (cart.quantities[productIndex] === 0) {
        cart.products.splice(productIndex, 1);
        cart.quantities.splice(productIndex, 1);
      }
    }

    return cart.save();
  }

  async viewCart(userId: string): Promise<Cart> {
    return this.cartModel.findOne({ user: userId }).populate('products');
  }

  async checkout(
    userId: string,
    address: string,
    paymentMethod: string,
  ): Promise<any> {
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('products');

    if (!cart || cart.products.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    const purchaseSummary = {
      products: cart.products,
      totalAmount: cart.products.reduce((sum, product, index) => {
        return (
          sum +
          (product as unknown as ProductDocument).price * cart.quantities[index]
        );
      }, 0),
      address,
      paymentMethod,
      purchaseDate: new Date(),
    };

    cart.checkedOut = true;
    cart.purchaseDate = new Date();

    await cart.save();

    return purchaseSummary;
  }

  async hasPurchased(userId: string, productId: string): Promise<boolean> {
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('products');
    return (
      cart &&
      cart.products.some((product) => product._id.toString() === productId)
    );
  }

  async getPurchaseHistory(userId: string): Promise<any[]> {
    const purchases = await this.cartModel
      .find({ user: userId, checkedOut: true })
      .populate('products');

    return purchases.map((purchase) => ({
      products: purchase.products,
      totalAmount: purchase.products.reduce((sum, product, index) => {
        return (
          sum +
          (product as unknown as ProductDocument).price *
            purchase.quantities[index]
        );
      }, 0),
      purchaseDate: purchase.purchaseDate,
    }));
  }
}
