import { ReservationPaymentDTO } from "../dtos/reservationPayment.dto";
import { Document } from "mongoose";

export const createReservationPayment = async (data: Partial<Document>) => {
  return await ReservationPaymentDTO.create(data);
};

export const updateReservationPayment = async (id: string, data: Partial<Document>) => {
  return await ReservationPaymentDTO.findByIdAndUpdate(id, data, { new: true });
};

export const deleteReservationPayment = async (id: string) => {
  return await ReservationPaymentDTO.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export const findReservationPaymentById = async (id: string) => {
  return await ReservationPaymentDTO.findOne({ _id: id, isDeleted: false }).populate("reservation paidBy customer parkingArea parkingSlot");
};

export const findAllReservationPayments = async () => {
  return await ReservationPaymentDTO.find({ isDeleted: false }).populate("reservation paidBy customer parkingArea parkingSlot");
};

export const findReservationPaymentsByReservation = async (reservationId: string) => {
  return await ReservationPaymentDTO.find({ reservation: reservationId, isDeleted: false }).populate("paidBy customer parkingArea parkingSlot");
};

export const findReservationPaymentsByCustomer = async (customerId: string) => {
  return await ReservationPaymentDTO.find({ customer: customerId, isDeleted: false }).populate("reservation parkingArea parkingSlot");
};

export const findReservationPaymentsByParkingArea = async (parkingAreaId: string) => {
  return await ReservationPaymentDTO.find({ parkingArea: parkingAreaId, isDeleted: false }).populate("reservation paidBy customer");
};

export const findReservationPaymentsByParkingSlot = async (parkingSlotId: string) => {
  return await ReservationPaymentDTO.find({ parkingSlot: parkingSlotId, isDeleted: false }).populate("reservation paidBy customer parkingArea");
};

export const findReservationPaymentsByPaymentStatus = async (paymentStatus: string) => {
  return await ReservationPaymentDTO.find({ paymentStatus, isDeleted: false }).populate("reservation paidBy customer parkingArea parkingSlot");
};

export const findReservationPaymentsByPaymentMethod = async (paymentMethod: string) => {
  return await ReservationPaymentDTO.find({ paymentMethod, isDeleted: false }).populate("reservation paidBy customer parkingArea parkingSlot");
};

export const findReservationPaymentsByDateRange = async (startDate: Date, endDate: Date) => {
  return await ReservationPaymentDTO.find({
    paymentDate: { $gte: startDate, $lte: endDate },
    isDeleted: false
  }).populate("reservation paidBy customer parkingArea parkingSlot");
};

export const findReservationPaymentsByReferenceNumber = async (referenceNumber: string) => {
  return await ReservationPaymentDTO.findOne({ 
    referenceNumber: referenceNumber, 
    isDeleted: false 
  }).populate("reservation paidBy customer parkingArea parkingSlot");
};

export const findReservationPaymentsByPaidBy = async (paidById: string) => {
  return await ReservationPaymentDTO.find({ 
    paidBy: paidById, 
    isDeleted: false 
  }).populate("reservation customer parkingArea parkingSlot");
};

export const findReservationPaymentsByAmountRange = async (minAmount: number, maxAmount: number) => {
  return await ReservationPaymentDTO.find({
    paymentAmount: { $gte: minAmount, $lte: maxAmount },
    isDeleted: false
  }).populate("reservation paidBy customer parkingArea parkingSlot");
};

export const findSuccessfulPayments = async () => {
  return await ReservationPaymentDTO.find({ 
    paymentStatus: 'paid', 
    isDeleted: false 
  }).populate("reservation paidBy customer parkingArea parkingSlot");
};

export const findFailedPayments = async () => {
  return await ReservationPaymentDTO.find({ 
    paymentStatus: 'failed', 
    isDeleted: false 
  }).populate("reservation paidBy customer parkingArea parkingSlot");
};

export const findPendingPayments = async () => {
  return await ReservationPaymentDTO.find({ 
    paymentStatus: 'pending', 
    isDeleted: false 
  }).populate("reservation paidBy customer parkingArea parkingSlot");
};

export const findRefundedPayments = async () => {
  return await ReservationPaymentDTO.find({ 
    paymentStatus: 'refunded', 
    isDeleted: false 
  }).populate("reservation paidBy customer parkingArea parkingSlot");
}; 