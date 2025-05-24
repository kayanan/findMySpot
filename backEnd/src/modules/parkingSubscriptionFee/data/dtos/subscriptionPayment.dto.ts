import { ObjectId, Schema, model } from "mongoose";
import { BaseDTO } from "../../../base/data/dtos/base.dto";

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
}
export enum PaymentGateway {
  PAYHERE = "PAYHERE",
  STRIPE = "STRIPE",
  BANK_TRANSFER = "BANK_TRANSFER",
}
export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}
export interface SubscriptionPaymentModel extends BaseDTO {
  parkingOwnerId:ObjectId;
  parkingAreaId:ObjectId;
  amount:number;
  paymentStatus:PaymentStatus;
  paymentDate:Date;
  paymentMethod:PaymentMethod;
  paymentReference:string;
  paymentGateway:PaymentGateway;
  isDeleted:boolean;
  createdBy:ObjectId;
  subscriptionStartDate:Date;
  subscriptionEndDate:Date;
}

const SubscriptionPaymentSchema = new Schema<SubscriptionPaymentModel>({
  parkingOwnerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  parkingAreaId: { type: Schema.Types.ObjectId, required: true, ref: "ParkingArea" },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: PaymentStatus, required: true },
  paymentDate: { type: Date, required: true },
  paymentMethod: { type: String, enum: PaymentMethod, required: true },
  paymentReference: { type: String, required: true },
  paymentGateway: { type: String, enum: PaymentGateway, required: true },
  isDeleted: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  subscriptionStartDate: { type: Date, required: true },
  subscriptionEndDate: { type: Date, required: true },
});

export const SubscriptionPaymentDTO = model<SubscriptionPaymentModel>("SubscriptionPayment", SubscriptionPaymentSchema);