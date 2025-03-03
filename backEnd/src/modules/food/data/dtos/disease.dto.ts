import { Schema, model } from 'mongoose';
import { BaseDTO } from '../../../base/data/dtos/base.dto';

export interface DiseaseModel extends BaseDTO {
  name: string;
  description: string;
}

const DiseaseSchema = new Schema<DiseaseModel>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const DiseaseDTO = model<DiseaseModel>(
  'Disease',
  DiseaseSchema
);
