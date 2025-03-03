import { Schema, model } from 'mongoose';
import { BaseDTO } from '../../../base/data/dtos/base.dto';
import { AssetBaseType, AssetExtType } from '../../types/asset.type';

export interface AssetModel extends BaseDTO {
  name: string;
  base: AssetBaseType;
  ext: AssetExtType;
  isUploaded: boolean;
  url?: string;
}

const AssetSchema = new Schema<AssetModel>(
  {
    name: { type: String, required: true },
    base: { type: String, required: true, enum: AssetBaseType },
    ext: { type: String, required: true, enum: AssetExtType },
    isUploaded: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AssetDTO = model<AssetModel>('Asset', AssetSchema);
