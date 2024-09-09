import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './review.schema';
import { User, UserDocument } from 'src/users/user.schema';
import { Product, ProductDocument } from 'src/products/product.schema';
import { CartService } from 'src/cart/cart.service'; 

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly cartService: CartService, 
  ) {}

  async addReview(
    userId: string,
    productId: string,
    rating: number,
    comment: string,
  ): Promise<Review> {
    
    const userPurchased = await this.cartService.hasPurchased(
      userId,
      productId,
    );
    if (!userPurchased) {
      throw new ForbiddenException(
        'You cannot review a product you haven’t purchased',
      );
    }

    const review = new this.reviewModel({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    const savedReview = await review.save();

    
    await this.productModel.findByIdAndUpdate(productId, {
      $push: { reviews: savedReview._id },
    });

    return savedReview;
  }

  async getReviewsByProduct(productId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ product: productId })
      .populate('user', 'username');
  }
}
