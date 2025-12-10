import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  customerName: string;
  phone: string;
  orderType: 'pickup' | 'dine-in';
  pickupTime: string;
  paymentMethod: 'cash' | 'paypal';
  items: {
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  total: number;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  orderType: { type: String, enum: ['pickup', 'dine-in'], default: 'pickup' },
  pickupTime: { type: String, required: true },
  paymentMethod: { type: String, enum: ['cash', 'paypal'], required: true },
  items: [{
    name: String,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
