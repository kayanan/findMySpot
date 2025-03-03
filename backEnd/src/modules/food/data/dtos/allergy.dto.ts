import mongoose, { ObjectId, Schema, model } from 'mongoose';
import { BaseDTO } from '../../../base/data/dtos/base.dto';

export interface AllergyModel extends BaseDTO {
  name: string;
  description: string;
}

const AllergySchema = new Schema<AllergyModel>(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export const AllergyDTO = model<AllergyModel>(
  'Allergy',
  AllergySchema
);
