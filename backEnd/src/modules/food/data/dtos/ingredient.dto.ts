import { Schema, model } from 'mongoose';
import { BaseDTO } from '../../../base/data/dtos/base.dto';

export interface IngredientModel extends BaseDTO {
  name: string;
  isAvailable: boolean;
  isDeleted: boolean;
  description?: string;
}

const IngredientSchema = new Schema<IngredientModel>(
  {
    name: { type: String, unique: true, required: true },
    isDeleted: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const IngredientDTO = model<IngredientModel>(
  'Ingredient',
  IngredientSchema
);
