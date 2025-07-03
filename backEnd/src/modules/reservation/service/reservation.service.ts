import { ReservationModel, ReservationStatus } from "../data/dtos/reservation.dto";
import {
  createReservation,
  updateReservation,
  deleteReservation,
  findReservationById,
  findAllReservations,
  findReservationsByUser,
  findReservationsByParkingArea,
  findReservationsByParkingSlot,
  findActiveReservations,
  findReservationsByStatus,
  findReservationsByPaymentStatus,
  findReservationByVehicleNumber,
  findReservationsByDateRange,
  findReservationsByMobileNumber
} from "../data/repositories/reservation.repository";
import { ReservationValidator } from "../validators/reservation.validator";
import mongoose, { ObjectId, Document } from "mongoose";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { filterParkingSlots, updateSlot } from "../../parkingArea/service/parkingSlot.service";
import { getVehicleByVehicleType } from "../../parkingSubscriptionFee/service/vehicle.service";


export const createReservationService = async (reservationData: Omit<ReservationModel, "isDeleted">) => {
  if(!reservationData?.startDateAndTime){
    reservationData.startDateAndTime = new Date();
  }
  const valResult = ReservationValidator.createReservationValidator(reservationData);
  if (valResult.error) {
    throw new Error(valResult.error.message);
  }
  return await createReservation(valResult.data as Partial<Document>);
};

export const updateReservationService = async (id: string, reservationData: Partial<ReservationModel>) => {
  const valResult = ReservationValidator.updateReservationValidator(reservationData);
  if (valResult.error) {
    throw new Error(valResult.error.message);
  }
  return await updateReservation(id, reservationData);
};

export const deleteReservationService = async (id: string) => {
  return await deleteReservation(id);
};

export const getReservationByIdService = async (id: string) => {
  return await findReservationById(id);
};

export const getAllReservationsService = async () => {
  return await findAllReservations();
};

export const getReservationsByUserService = async (userId: string) => {
  return await findReservationsByUser(userId);
};

export const getReservationsByParkingAreaService = async (parkingAreaId: string) => {
  return await findReservationsByParkingArea(parkingAreaId);
};

export const getReservationsByParkingSlotService = async (parkingSlotId: string) => {
  return await findReservationsByParkingSlot(parkingSlotId);
};

export const getActiveReservationsService = async () => {
  return await findActiveReservations();
};

export const getReservationsByStatusService = async (status: string) => {
  return await findReservationsByStatus(status);
};

export const getReservationsByPaymentStatusService = async (paymentStatus: string) => {
  return await findReservationsByPaymentStatus(paymentStatus);
};

export const getReservationByVehicleNumberService = async (vehicleNumber: string) => {
  return await findReservationByVehicleNumber(vehicleNumber);
};

export const getReservationsByDateRangeService = async (startDate: Date, endDate: Date) => {
  return await findReservationsByDateRange(startDate, endDate);
};

export const getReservationsByMobileNumberService = async (mobileNumber: string) => {
  return await findReservationsByMobileNumber(mobileNumber);
};

export const completeReservationService = async (id: string) => {
  const reservation = await findReservationById(id);
  if (!reservation) {
    throw new Error("Reservation not found");
  }
  dayjs.extend(duration);
  const endTime : Date = new Date();
  const startTime : Date = new Date(reservation.startDateAndTime);
  const diff = dayjs.duration(endTime.getTime() - startTime.getTime());
  const hoursDiff = Math.ceil(diff.asMinutes()/60);
  return await updateReservation(id, {
    endDateAndTime: endTime,
    totalAmount: Math.ceil(hoursDiff) * (reservation.perHourRate || 0)
  } as Partial<ReservationModel>);
};

export const cancelReservationService = async (id: string) => {
  return await updateReservation(id, { status: 'cancelled' } as Partial<ReservationModel>);
};

export const updatePaymentStatusService = async (id: string, paymentStatus: string) => {
  return await updateReservation(id, { paymentStatus } as Partial<ReservationModel>);
}; 

export const createPreBookingReservationService = async (reservationData: Partial<ReservationModel>) => {
    const slotFilterData:{vehicleType:string,startTime:Date,endTime?:Date}= {
        vehicleType:reservationData.vehicleType?.toString().toLowerCase() as unknown as string,
        startTime:new Date(reservationData.startDateAndTime as Date),
        }
      if(reservationData.endDateAndTime){
        slotFilterData.endTime = new Date(reservationData.endDateAndTime as Date);
      }
     const [vehicle,parkingSlots] = await Promise.all([
      getVehicleByVehicleType(reservationData.vehicleType as unknown as string),
      filterParkingSlots(slotFilterData,[{_id:mongoose.Types.ObjectId.createFromHexString(reservationData.parkingArea as unknown as string)}])
     ])
     
    if(parkingSlots.length === 0){
      throw new Error("No parking slots found");
    }
    if(parkingSlots[0].slotCount === 0){
      throw new Error("No parking slots available");
    }
    const parkingSlotId = parkingSlots[0].slots[0];


    reservationData.parkingSlot = parkingSlotId;
    delete reservationData.vehicleType;
    reservationData.vehicleType = vehicle._id as ObjectId;
    const reservation = await createReservation(reservationData);
    if (reservation){
      await updateSlot(parkingSlotId, {
        isReservationPending: true,
        reservedVehicleNumber: reservationData.vehicleNumber,
        addReservationId: reservation._id as unknown as string
      });
    }
    return reservation;
  
};