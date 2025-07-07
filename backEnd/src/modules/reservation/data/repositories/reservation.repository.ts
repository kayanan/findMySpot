import { ReservationDTO, ReservationModel, ReservationStatus } from "../dtos/reservation.dto";
import mongoose, { UpdateQuery } from "mongoose";
import { ReservationPaymentModel } from "../dtos/reservationPayment.dto";

export const createReservation = async (data: Partial<ReservationModel>) => {
  return await ReservationDTO.create(data);
};

export const updateReservation = async (id: string, data: UpdateQuery<Partial<ReservationModel>>) => {
  return await ReservationDTO.findByIdAndUpdate(id, data, { new: true }).populate("parkingSlot");
};

export const deleteReservation = async (id: string) => {
  return await ReservationDTO.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export const findReservationById = async (id: string):Promise<ReservationModel & { paymentIds: ReservationPaymentModel[] } | null> => {
  return await ReservationDTO.findOne({ _id: id, isDeleted: false }).populate(["parkingSlot", "parkingArea" ,"user" ,"createdBy" ,"vehicleType", "paymentIds" ]).lean() as ReservationModel & { paymentIds: ReservationPaymentModel[] } | null;
};

export const findAllReservations = async () => {
  return await ReservationDTO.find({ isDeleted: false }).populate("parkingSlot parkingArea user createdBy");
};

export const findReservationsByUser = async (userId: string) => {
  return await ReservationDTO.find({ user: userId, isDeleted: false }).populate("parkingSlot parkingArea");
};

export const findReservationsByParkingArea = async (parkingAreaId: string) => {
  return await ReservationDTO.find({ parkingArea: parkingAreaId, isDeleted: false }).populate("parkingSlot user");
};

export const findReservationsByParkingSlot = async (parkingSlotId: string) => {
  return await ReservationDTO.find({ parkingSlot: parkingSlotId, isDeleted: false }).populate("user parkingArea");
};

export const findActiveReservations = async () => {
  return await ReservationDTO.find({ status: 'active', isDeleted: false }).populate("parkingSlot parkingArea user");
};

export const findReservationsByStatus = async (status: string) => {
  return await ReservationDTO.find({ status, isDeleted: false }).populate("parkingSlot parkingArea user");
};

export const findReservationsByPaymentStatus = async (paymentStatus: string) => {
  return await ReservationDTO.find({ paymentStatus, isDeleted: false }).populate("parkingSlot parkingArea user");
};

export const findReservationByVehicleNumber = async (vehicleNumber: string) => {
  const reservation = await ReservationDTO.findOne({
    vehicleNumber: vehicleNumber.toLowerCase().replace(/\s+/g, ''),
    $or: [
      {
        status: ReservationStatus.PENDING,
        createdAt: { $gte: new Date(new Date().getTime() - 1000 * 60 * 5) }
      },
      {
        status: ReservationStatus.CONFIRMED,
        $or: [
          {
            startDateAndTime: { $gte: new Date() }
          },
          {
            startDateAndTime: { $gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 1) }
          }
        ]
      }
    ],
    isDeleted: { $ne: true }
  })
  return reservation;
};

export const findReservationsByDateRange = async (startDate: Date, endDate: Date) => {
  return await ReservationDTO.find({
    startTime: { $gte: startDate, $lte: endDate },
    isDeleted: false
  }).populate("parkingSlot parkingArea user");
};

export const findReservationsByMobileNumber = async (mobileNumber: string) => {
  return await ReservationDTO.find({
    customerMobile: mobileNumber,
    isDeleted: false
  }).populate("parkingSlot parkingArea user");
};
