import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReservation extends Document {
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  guests: number;
  type: string; // Added visit type
  comments?: string; // Added comments
  status: 'Pendiente' | 'Confirmado' | 'Cancelado';
  createdAt: Date;
}

const ReservationSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  type: { type: String, default: 'Desayuno' }, // Added visit type
  comments: { type: String }, // Added comments
  status: { type: String, enum: ['Pendiente', 'Confirmado', 'Cancelado'], default: 'Pendiente' },
  createdAt: { type: Date, default: Date.now },
});

const Reservation: Model<IReservation> = mongoose.models.Reservation || mongoose.model<IReservation>('Reservation', ReservationSchema);

export default Reservation;
