import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  rating: {
    rate: number;
    count: number;
  };

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  _id: string;
  
  @Prop([{ type: Types.ObjectId, ref: 'Review' }])
  reviews: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
