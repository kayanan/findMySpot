import { ObjectId, Schema, model } from "mongoose";
import { BaseDTO } from "../../../base/data/dtos/base.dto";

export enum ReservationStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}
export enum ReservationType {
  PRE_BOOKING = "pre_booking",
  ON_SPOT = "on_spot",
}
export enum PaymentStatus{
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}
export enum PaymentType {
  CASH = "cash",
  CARD = "card",
  BANK_TRANSFER = "bank_transfer",
}
export interface ReservationModel extends BaseDTO {
  parkingSlot: ObjectId;
  parkingArea: ObjectId;
  user: ObjectId;
  type: ReservationType;
  perHourRate: number;
  vehicleNumber: string;
  customerMobile: string;
  startDateAndTime: Date;
  endDateAndTime?: Date;
  advanceAmount: number;
  totalAmount: number;
  vehicleType: ObjectId;
  status: ReservationStatus;
  paymentIds: ObjectId[];
  paymentStatus: PaymentStatus;
  paymentType: PaymentType;
  isDeleted: boolean;
  createdBy: ObjectId;
}

const ReservationSchema = new Schema<ReservationModel>(
  {
    parkingSlot: { type: Schema.Types.ObjectId, required: true, ref: "ParkingSlot" },
    parkingArea: { type: Schema.Types.ObjectId, required: true, ref: "ParkingArea" },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    type: { type: String, required: true, enum: ReservationType, default: ReservationType.PRE_BOOKING },
    perHourRate: { type: Number, required: true },
    vehicleNumber: { type: String, required: true ,trim:true,lowercase:true},
    customerMobile: { type: String, required: true },
    startDateAndTime: { type: Date, required: true, default: Date.now },
    endDateAndTime: { type: Date },
    advanceAmount: { type: Number },
    vehicleType: { type: Schema.Types.ObjectId, required: true, ref: "Vehicle" },
    totalAmount: { type: Number },
    status: { 
      type: String, 
      required: true, 
      enum: ReservationStatus,
      default: ReservationStatus.PENDING
    },
    paymentStatus: { 
      type: String, 
      required: true, 
      enum: PaymentStatus,
      default: PaymentStatus.PENDING
    },
    paymentType: { 
      type: String, 
      required: true, 
      enum: PaymentType,
      default: PaymentType.CASH
    },
    paymentIds: { type: [Schema.Types.ObjectId], required: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);



export const ReservationDTO = model<ReservationModel>("Reservation", ReservationSchema); 