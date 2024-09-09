import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
    Patch,
  Request
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('add-products')
  @UseGuards(JwtAuthGuard)
  async addProductsFromAPI() {
    return this.productsService.addProductsFromAPI();
  }

  @Get('search')
  async searchProducts(
    @Query('keyword') keyword: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.productsService.searchProducts(keyword, sortBy, sortOrder);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: any,
    @Req() req: any,
  ) {
    const userId = req.user._id;
    return this.productsService.updateProduct(id, updateProductDto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Param('id') id: string, @Req() req: any) {
    const userId = req.user._id;
    return this.productsService.deleteProduct(id, userId);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard)
  async deactivateProduct(@Param('id') id: string, @Request() req) {
    const user = req.user;
    return this.productsService.deactivateProduct(id, user);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard)
  async activateProduct(@Param('id') id: string, @Request() req) {
    const user = req.user;
    return this.productsService.activateProduct(id, user);
  }
}
