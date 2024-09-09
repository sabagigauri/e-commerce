import { Controller, Post, Body, Param, Request, Get, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; 

@Controller('products/:productId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addReview(
    @Request() req,
    @Param('productId') productId: string,
    @Body('rating') rating: number,
    @Body('comment') comment: string,
  ) {
    const userId = req.user.userId; 
    return this.reviewService.addReview(userId, productId, rating, comment);
  }

  @Get()
  async getReviews(@Param('productId') productId: string) {
    return this.reviewService.getReviewsByProduct(productId);
  }
}
