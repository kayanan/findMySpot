import { ObjectId, Schema, model } from "mongoose";
import { BaseDTO } from "../../../base/data/dtos/base.dto";

export interface ParkingSlotModel extends BaseDTO {
  parkingAreaId: Schema.Types.ObjectId | String;
  slotNumber: number;
  slotType: ObjectId;
  slotDescription: string;
  slotImage: string;
  slotSize: number;
  slotPrice: number;
  isActive: boolean;
  isDeleted: boolean;
}

const ParkingSlotSchema = new Schema<ParkingSlotModel>(
  {
    parkingAreaId: { type: Schema.Types.ObjectId, ref: "ParkingArea" },
    slotType: { type: Schema.Types.ObjectId, ref: "Vehicle" },
    slotDescription: { type: String, required: true },
    slotImage: { type: String, required: true },
    slotSize: { type: Number, required: true },
    slotPrice: { type: Number, required: true },
    slotNumber: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ParkingSlotDTO = model<ParkingSlotModel>("ParkingSlot", ParkingSlotSchema);
