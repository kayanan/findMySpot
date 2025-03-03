import { Schema, model } from "mongoose";
import { BaseDTO } from "../../../base/data/dtos/base.dto";
export enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
export interface CityModel extends BaseDTO {
  name: string;
  status:Status;
  districtId: Schema.Types.ObjectId | String;
  isDeleted: boolean;
  description?: string;
}

const CitySchema = new Schema<CityModel>(
  {
    name: { type: String, unique: true, required: true },
     status:{type:String,required:true,enum:Object.values(Status) ,default:Status.ACTIVE},
    isDeleted: { type: Boolean, default: false },
    districtId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "District",
    },
    description: { type: String },
  },
  { timestamps: true }
);

export const CityDTO = model<CityModel>("City", CitySchema);
