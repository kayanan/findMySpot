import { Schema, model } from 'mongoose';
import { BaseDTO } from '../../../base/data/dtos/base.dto';
export enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
export interface DistrictModel extends BaseDTO {
  provinceId:Schema.Types.ObjectId;
  name: string;
   status:Status;
  description: string;
}


const DistrictSchema = new Schema<DistrictModel>(
  {
    name: { type: String, required: true, unique: true },
    provinceId:{type:Schema.Types.ObjectId,required:true,ref:"Province"},
     status:{type:String,required:true,enum:Object.values(Status) ,default:Status.ACTIVE},
    description: { type: String},
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const DistrictDTO = model<DistrictModel>(
  'District',
  DistrictSchema
);
