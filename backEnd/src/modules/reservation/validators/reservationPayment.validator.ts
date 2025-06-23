import { z } from "zod";
import { PaymentStatus, PaymentMethod } from "../data/dtos/reservationPayment.dto";

const createReservationPaymentSchema = z.object({
  reservation: z.string().min(1, "Reservation is required"),
  paymentStatus: z.enum(Object.values(PaymentStatus) as [string]).default(PaymentStatus.PENDING),
  paymentAmount: z.number().positive("Payment amount must be positive"),
  paymentDate: z.date().default(new Date()),
  paymentMethod: z.enum(Object.values(PaymentMethod) as [string]).default(PaymentMethod.CASH),
  referenceNumber: z.string().optional(),
  images: z.array(z.string()).optional(),
  paidBy: z.string().min(1, "Paid by is required"),
  customer: z.string().min(1, "Customer is required"),
  parkingArea: z.string().min(1, "Parking area is required"),
  parkingSlot: z.string().min(1, "Parking slot is required"),
});

const updateReservationPaymentSchema = z.object({
  reservation: z.string().min(1, "Reservation is required").optional(),
  paymentStatus: z.enum(Object.values(PaymentStatus) as [string]).optional(),
  paymentAmount: z.number().positive("Payment amount must be positive").optional(),
  paymentDate: z.date().optional(),
  paymentMethod: z.enum(Object.values(PaymentMethod) as [string]).optional(),
  referenceNumber: z.string().optional(),
  images: z.array(z.string()).optional(),
  paidBy: z.string().min(1, "Paid by is required").optional(),
  customer: z.string().min(1, "Customer is required").optional(),
  parkingArea: z.string().min(1, "Parking area is required").optional(),
  parkingSlot: z.string().min(1, "Parking slot is required").optional(),
  isDeleted: z.boolean().default(false).optional(),
});

export const ReservationPaymentValidator = {
  createReservationPaymentValidator: (data: unknown) => {
    return createReservationPaymentSchema.safeParse(data);
  },
  updateReservationPaymentValidator: (data: unknown) => {
    return updateReservationPaymentSchema.safeParse(data);
  },
}; 