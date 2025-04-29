import mongoose, {  Schema, model } from "mongoose";
import { BaseDTO } from "../../../base/data/dtos/base.dto";

export const addressSchema = new Schema({
  line1: { type: String, required: true },
  line2: { type: String, required: true },
  city: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "City" },
  district: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "District" },
  province: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Province" },
  postalCode: { type: String, required: true },
});
export interface ParkingAreaModel extends BaseDTO {
  name: string;
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  };
  ownerId: mongoose.Schema.Types.ObjectId;
  contactNumber: string;
  email: string;
  images: string[];
  description: string;
  address: typeof addressSchema;
  isActive: boolean;
  isDeleted: boolean;
  
}

const ParkingAreaSchema = new Schema<ParkingAreaModel>(
  {
    name: { type: String, required: true },
    location: {
        type: {
            type: String,          
            enum: ['Point'],        
          required: true
        },
        coordinates: {
          type: [Number],         
          required: true
        }
      },
      ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
      address: { type: addressSchema, required: true },
      contactNumber: { type: String, required: true },
      email: { type: String, required: true },
      images: { type: [String], required: true },
      description: { type: String, required: true },
      isActive: { type: Boolean, default: true },
      isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ParkingAreaDTO = model<ParkingAreaModel>("ParkingArea", ParkingAreaSchema); 