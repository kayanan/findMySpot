import { ObjectId, Schema, model } from "mongoose";
import { BaseDTO } from "../../../base/data/dtos/base.dto";
import { ParkingSubscriptionFeeDTO } from "@/src/modules/parkingSubscriptionFee/data/dtos/parkingSubscriptionFee.dto";

export enum ReservationType {
    PRE_BOOKING = "pre_booking",
    ON_SPOT = "on_spot",
}

export enum ReservationStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
}

export interface ReservationModel extends BaseDTO {
    startDateAndTime: Date;
    endDateAndTime: Date;
    vehicleType: ObjectId;
    slotId: ObjectId;
    vehicleNumber: string;
    type: ReservationType;
    advanceAmount: number;
    totalAmount: number;
    status: ReservationStatus;
    paymentIds: ObjectId[];
    isDeleted: boolean;
    customerId: ObjectId;
    createdBy: ObjectId;
}

const ReservationSchema = new Schema<ReservationModel>(
    {
        startDateAndTime: { type: Date, required: true },
        endDateAndTime: { type: Date, required: true },
        vehicleType: { type: Schema.Types.ObjectId, required: true, ref: "Vehicle" },
        slotId: { type: Schema.Types.ObjectId, required: true, ref: "ParkingSlot" },
        vehicleNumber: { type: String, required: true },
        type: { type: String, required: true, enum: ReservationType },
        advanceAmount: { type: Number, required: true },
        totalAmount: { type: Number, required: true },
        status: { type: String, required: true, enum: ReservationStatus },
        paymentIds: { type: [Schema.Types.ObjectId], required: true, ref: "Payment" },
        isDeleted: { type: Boolean, default: false },
        customerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    },
    { timestamps: true }
);

export const ReservationDTO = model<ReservationModel>("Reservation", ReservationSchema);