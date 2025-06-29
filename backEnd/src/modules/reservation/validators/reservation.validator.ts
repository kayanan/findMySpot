import { z } from "zod";
import { ReservationStatus } from "../data/dtos/reservation.dto";

const createReservationSchema = z.object({
  parkingSlot: z.string().min(1, "Parking slot is required"),
  parkingArea: z.string().min(1, "Parking area is required"),
  user: z.string().min(1, "User is required"),
  type: z.enum(['pre_booking', 'on_spot']),
  vehicleNumber: z.string()
    .min(1, "Vehicle number is required")
    .regex(/^[A-Z]{2,3}\s?\d{4}$/, "Invalid vehicle number format (e.g., ABC-1234)"),
  customerMobile: z.string()
    .min(1, "Customer mobile is required")
    .regex(/^(\+94|0)?[1-9][0-9]{8}$/, "Invalid mobile number format"),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  totalAmount: z.number().positive("Total amount must be positive").optional(),
  perHourRate: z.number().positive("Per hour rate must be positive").optional(),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  status: z.enum(Object.values(ReservationStatus) as [string, ...string[]]).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed']).optional(),
  paymentType: z.enum(['cash', 'card', 'bank_transfer']).optional(),
  createdBy: z.string().min(1, "Created by is required"),
});

const updateReservationSchema = z.object({
  parkingSlot: z.string().min(1, "Parking slot is required").optional(),
  parkingArea: z.string().min(1, "Parking area is required").optional(),
  user: z.string().min(1, "User is required").optional(),
  type: z.enum(['pre_booking', 'on_spot']).optional(),
  vehicleNumber: z.string()
    .min(1, "Vehicle number is required")
    .regex(/^[A-Z]{2,3}\s?\d{4}$/, "Invalid vehicle number format (e.g., ABC-1234)")
    .optional(),
  customerMobile: z.string()
    .min(1, "Customer mobile is required")
    .regex(/^(\+94|0)?[1-9][0-9]{8}$/, "Invalid mobile number format")
    .optional(),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  perHourRate: z.number().positive("Per hour rate must be positive").optional(),
  vehicleType: z.string().min(1, "Vehicle type is required").optional(),
  totalAmount: z.number().positive("Total amount must be positive").optional(),
  status: z.enum(Object.values(ReservationStatus) as [string, ...string[]]).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed']).optional(),
  paymentType: z.enum(['cash', 'card', 'bank_transfer']).optional(),
});

export const ReservationValidator = {
  createReservationValidator: (data: unknown) => {
    return createReservationSchema.safeParse(data);
  },
  updateReservationValidator: (data: unknown) => {
    return updateReservationSchema.safeParse(data);
  },
}; 