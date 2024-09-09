import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/products/product.schema';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'Product' }])
  products: Types.ObjectId[];

  @Prop([Number])
  quantities: number[];

  @Prop({ default: false })
  checkedOut: boolean; 

  @Prop()
  purchaseDate: Date; 
}

export const CartSchema = SchemaFactory.createForClass(Cart);
