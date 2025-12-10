import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILoyalty extends Document {
  name: string;
  email: string;
  points: number;
  history: {
    date: Date;
    amount: number;
    pointsEarned: number;
  }[];
}

const LoyaltySchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  points: { type: Number, default: 0 },
  history: [{
    date: { type: Date, default: Date.now },
    amount: Number,
    pointsEarned: Number,
  }],
});

const Loyalty: Model<ILoyalty> = mongoose.models.Loyalty || mongoose.model<ILoyalty>('Loyalty', LoyaltySchema);

export default Loyalty;
