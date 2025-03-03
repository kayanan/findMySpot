import mongoose, { ObjectId, Schema, model } from 'mongoose';
import { BaseDTO } from '../../../base/data/dtos/base.dto';

export interface ProvinceModel extends BaseDTO {
  name: string;
  status:Status;
  description: string;
}
export enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
const ProvinceSchema = new Schema<ProvinceModel>(
  {
    name: { type: String, unique: true, required: true },
    status:{type:String,required:true,enum:Object.values(Status) ,default:Status.ACTIVE},
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export const ProvinceDTO = model<ProvinceModel>(
  'Province',
  ProvinceSchema
);
