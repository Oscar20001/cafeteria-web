import mongoose, { Schema, Document } from 'mongoose';

export interface IMenu extends Document {
  menuId: string; // e.g., 'breakfast', 'lunch'
  name: string;   // e.g., 'Desayunos', 'Comidas'
  heyzineUrl: string;
  updatedAt: Date;
}

const MenuSchema = new Schema<IMenu>({
  menuId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  heyzineUrl: { type: String, required: false },
  updatedAt: { type: Date, default: Date.now },
});

// Prevent overwriting the model if it's already compiled
export default mongoose.models.Menu || mongoose.model<IMenu>('Menu', MenuSchema);
