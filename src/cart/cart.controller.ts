import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Adjust the path if necessary

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Add product to cart
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addToCart(@Request() req: any, @Body('productId') productId: string) {
    const userId = req.user._id; // Extract user ID from JWT
    return this.cartService.addToCart(userId, productId);
  }

  // Remove product from cart
  @UseGuards(JwtAuthGuard)
  @Delete('remove')
  async removeFromCart(
    @Request() req: any,
    @Body('productId') productId: string,
  ) {
    const userId = req.user._id;
    return this.cartService.removeFromCart(userId, productId);
  }

  // View cart items
  @UseGuards(JwtAuthGuard)
  @Get('view')
  async viewCart(@Request() req: any) {
    const userId = req.user._id;
    return this.cartService.viewCart(userId);
  }

  // Checkout and clear the cart
  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async checkout(
    @Request() req: any,
    @Body('address') address: string,
    @Body('paymentMethod') paymentMethod: string,
  ) {
    const userId = req.user._id;
    return this.cartService.checkout(userId, address, paymentMethod);
  }

  // Get purchase history
  @UseGuards(JwtAuthGuard)
  @Get('purchase-history')
  async getPurchaseHistory(@Request() req: any) {
    const userId = req.user._id;
    return this.cartService.getPurchaseHistory(userId);
  }
}
