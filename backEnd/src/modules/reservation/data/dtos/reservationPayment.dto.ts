import { ObjectId, Schema, model } from "mongoose";
import { BaseDTO } from "../../../base/data/dtos/base.dto";

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
    REFUNDED = "refunded",
}

export enum PaymentMethod {
    CASH = "cash",
    CARD = "card",
    BANK_TRANSFER = "bank_transfer",
}
export interface ReservationPaymentModel extends BaseDTO {
    reservation: ObjectId;
    paymentStatus: PaymentStatus;
    paymentAmount: number;
    paymentDate: Date;
    paymentMethod: PaymentMethod;
    referenceNumber: string;
    bankName: string;
    branch: string;
    cardNumber: string;
    transactionDate: Date;
    images: Array<string>;
    paidBy: ObjectId;
    customer: ObjectId;
    parkingArea: ObjectId;
    parkingSlot: ObjectId;

}

const ReservationPaymentSchema = new Schema<ReservationPaymentModel>(
    {
        reservation: { type: Schema.Types.ObjectId, required: true, ref: "Reservation" },
        paymentStatus: { type: String, required: true, enum: PaymentStatus, default: PaymentStatus.PENDING },
        paymentAmount: { type: Number, required: true },
        paymentDate: { type: Date, required: true, default: Date.now },
        paymentMethod: { type: String, required: true, enum: PaymentMethod, default: PaymentMethod.CASH },
        referenceNumber: { type: String, required: false },
        bankName: { type: String, required: false },
        branch: { type: String, required: false },
        cardNumber: { type: String, required: false },
        images: { type: [String], required: false },
        paidBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        customer: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        parkingArea: { type: Schema.Types.ObjectId, required: true, ref: "ParkingArea" },
        parkingSlot: { type: Schema.Types.ObjectId, required: true, ref: "ParkingSlot" },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const ReservationPaymentDTO = model<ReservationPaymentModel>("ReservationPayment", ReservationPaymentSchema); 