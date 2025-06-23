import { ReservationPaymentModel } from "../data/dtos/reservationPayment.dto";
import {
  createReservationPayment,
  updateReservationPayment,
  deleteReservationPayment,
  findReservationPaymentById,
  findAllReservationPayments,
  findReservationPaymentsByReservation,
  findReservationPaymentsByCustomer,
  findReservationPaymentsByParkingArea,
  findReservationPaymentsByParkingSlot,
  findReservationPaymentsByPaymentStatus,
  findReservationPaymentsByPaymentMethod,
  findReservationPaymentsByDateRange,
  findReservationPaymentsByReferenceNumber,
  findReservationPaymentsByPaidBy,
  findReservationPaymentsByAmountRange,
  findSuccessfulPayments,
  findFailedPayments,
  findPendingPayments,
  findRefundedPayments
} from "../data/repositories/reservationPayment.repository";
import { ReservationPaymentValidator } from "../validators/reservationPayment.validator";

export const createReservationPaymentService = async (data: Omit<ReservationPaymentModel, "isDeleted">) => {
  try {
    const value=ReservationPaymentValidator.createReservationPaymentValidator(data);
    if(!value.success){
      throw new Error(value.error.message);
    }
    const reservationPayment = await createReservationPayment(data);
    return reservationPayment;
  } catch (error) {
    throw new Error(`Failed to create reservation payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const updateReservationPaymentService = async (id: string, data: Partial<ReservationPaymentModel>) => {
  try {
    const reservationPayment = await updateReservationPayment(id, data);
    if (!reservationPayment) {
      throw new Error("Reservation payment not found");
    }
    return reservationPayment;
  } catch (error) {
    throw new Error(`Failed to update reservation payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const deleteReservationPaymentService = async (id: string) => {
  try {
    const reservationPayment = await deleteReservationPayment(id);
    if (!reservationPayment) {
      throw new Error("Reservation payment not found");
    }
    return reservationPayment;
  } catch (error) {
    throw new Error(`Failed to delete reservation payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getReservationPaymentByIdService = async (id: string) => {
  try {
    const reservationPayment = await findReservationPaymentById(id);
    return reservationPayment;
  } catch (error) {
    throw new Error(`Failed to get reservation payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getAllReservationPaymentsService = async () => {
  try {
    const reservationPayments = await findAllReservationPayments();
    return reservationPayments;
  } catch (error) {
    throw new Error(`Failed to get all reservation payments: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getReservationPaymentsByReservationService = async (reservationId: string) => {
  try {
    const reservationPayments = await findReservationPaymentsByReservation(reservationId);
    return reservationPayments;
  } catch (error) {
    throw new Error(`Failed to get reservation payments by reservation: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getReservationPaymentsByCustomerService = async (customerId: string) => {
  try {
    const reservationPayments = await findReservationPaymentsByCustomer(customerId);
    return reservationPayments;
  } catch (error) {
    throw new Error(`Failed to get reservation payments by customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getReservationPaymentsByParkingAreaService = async (parkingAreaId: string) => {
  try {
    const reservationPayments = await findReservationPaymentsByParkingArea(parkingAreaId);
    return reservationPayments;
  } catch (error) {
    throw new Error(`Failed to get reservation payments by parking area: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getReservationPaymentsByParkingSlotService = async (parkingSlotId: string) => {
  try {
    const reservationPayments = await findReservationPaymentsByParkingSlot(parkingSlotId);
    return reservationPayments;
  } catch (error) {
    throw new Error(`Failed to get reservation payments by parking slot: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getReservationPaymentsByPaymentStatusService = async (paymentStatus: string) => {
  try {
    const reservationPayments = await findReservationPaymentsByPaymentStatus(paymentStatus);
    return reservationPayments;
  } catch (error) {
    throw new Error(`Failed to get reservation payments by payment status: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getReservationPaymentsByPaymentMethodService = async (paymentMethod: string) => {
  try {
    const reservationPayments = await findReservationPaymentsByPaymentMethod(paymentMethod);
    return reservationPayments;
  } catch (error) {
    throw new Error(`Failed to get reservation payments by payment method: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getReservationPaymentsByDateRangeService = async (startDate: Date, endDate: Date) => {
  try {
    const reservationPayments = await findReservationPaymentsByDateRange(startDate, endDate);
    return reservationPayments;
  } catch (error) {
    throw new Error(`Failed to get reservation payments by date range: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getReservationPaymentByReferenceNumberService = async (referenceNumber: string) => {
  try {
    const reservationPayment = await findReservationPaymentsByReferenceNumber(referenceNumber);
    return reservationPayment;
  } catch (error) {
    throw new Error(`Failed to get reservation payment by reference number: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getReservationPaymentsByPaidByService = async (paidById: string) => {
  try {
    const reservationPayments = await findReservationPaymentsByPaidBy(paidById);
    return reservationPayments;
  } catch (error) {
    throw new Error(`Failed to get reservation payments by paid by: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getReservationPaymentsByAmountRangeService = async (minAmount: number, maxAmount: number) => {
  try {
    const reservationPayments = await findReservationPaymentsByAmountRange(minAmount, maxAmount);
    return reservationPayments;
  } catch (error) {
    throw new Error(`Failed to get reservation payments by amount range: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getSuccessfulPaymentsService = async () => {
  try {
    const reservationPayments = await findSuccessfulPayments();
    return reservationPayments;
  } catch (error) {
    throw new Error(`Failed to get successful payments: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getFailedPaymentsService = async () => {
  try {
    const reservationPayments = await findFailedPayments();
    return reservationPayments;
  } catch (error) {
    throw new Error(`Failed to get failed payments: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getPendingPaymentsService = async () => {
  try {
    const reservationPayments = await findPendingPayments();
    return reservationPayments;
  } catch (error) {
    throw new Error(`Failed to get pending payments: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getRefundedPaymentsService = async () => {
  try {
    const reservationPayments = await findRefundedPayments();
    return reservationPayments;
  } catch (error) {
    throw new Error(`Failed to get refunded payments: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 