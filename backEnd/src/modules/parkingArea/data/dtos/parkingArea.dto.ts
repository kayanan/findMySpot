import mongoose, {  Schema, model } from "mongoose";
import { BaseDTO } from "../../../base/data/dtos/base.dto";

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
  managerIds: Array<mongoose.Schema.Types.ObjectId>;
  parkingSubscriptionPaymentId: mongoose.Schema.Types.ObjectId;
  contactNumber: string;
  email: string;
  images: string[];
  description: string;
  addressLine1: string;
  addressLine2: string;
  city: mongoose.Schema.Types.ObjectId;
  district: mongoose.Schema.Types.ObjectId;
  province: mongoose.Schema.Types.ObjectId;
  postalCode: string;
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
      parkingSubscriptionPaymentId: { type: mongoose.Schema.Types.ObjectId, required: false, ref: "SubscriptionPayment" },
      managerIds: { type: [mongoose.Schema.Types.ObjectId], required: false, ref: "User" },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String},
      city: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "City" },
      district: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "District" },
      province: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Province" },
      postalCode: { type: String},

      contactNumber: { type: String, required: true,unique: true },
      email: { type: String, required: false,unique: true,lowercase: true },
      images: { type: [String], required: false },
      description: { type: String, required: false },
      isActive: { type: Boolean, default: false },
      isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ParkingAreaDTO = model<ParkingAreaModel>("ParkingArea", ParkingAreaSchema); 