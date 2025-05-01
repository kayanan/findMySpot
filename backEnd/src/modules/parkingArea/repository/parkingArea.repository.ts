import { ParkingAreaDTO, ParkingAreaModel } from "../data/dtos/parkingArea.dto";
import { Types } from "mongoose";
export const createParkingArea = async (parkingAreaData: Partial<ParkingAreaModel>) => {
  const parkingArea = new ParkingAreaDTO(parkingAreaData);
  return await parkingArea.save();
};

export const updateParkingArea = async (id: string, parkingAreaData: Partial<ParkingAreaModel>) => {
  const parkingArea = await ParkingAreaDTO.findByIdAndUpdate(
    id,
    { $set: parkingAreaData },
    { new: true }
  );
  if (!parkingArea) {
    throw new Error("Parking area not found");
  }
  return parkingArea;
};

export const deleteParkingArea = async (id: string) => {
  const parkingArea = await ParkingAreaDTO.findByIdAndUpdate(
    id,
    { $set: { isDeleted: true } },
    { new: true }
  );
  if (!parkingArea) {
    throw new Error("Parking area not found");
  }
  return parkingArea;
};

export const getParkingAreaById = async (id: string) => {
  return await ParkingAreaDTO.findOne({ _id: id, isDeleted: false });
};

export const getAllParkingAreas = async () => {
  return await ParkingAreaDTO.find({ isDeleted: false });
};

export const getActiveParkingAreas = async () => {
  return await ParkingAreaDTO.find({ isActive: true, isDeleted: false });
};

export const getParkingAreasByOwnerId = async (ownerId: string) => {

    const parkingAreas = await ParkingAreaDTO.find({ ownerId: new Types.ObjectId(ownerId), isDeleted: { $ne: true } })
        .populate('city')
        .populate('district')
        .populate('province')
        return parkingAreas;
};
export const updateParkingAreaByOwnerId = async (ownerId: string, data: Partial<ParkingAreaModel>) => {
  return await ParkingAreaDTO.updateMany({ ownerId: new Types.ObjectId(ownerId) }, { $set: data });
};

export const deleteParkingAreaByOwnerId = async (ownerId: string) => {
  return await ParkingAreaDTO.updateMany({ ownerId: new Types.ObjectId(ownerId) }, { $set: { isDeleted: true } });
};

// export const updateAvailableSlots = async (id: string, change: number) => {
//   const parkingArea = await ParkingAreaDTO.findById(id);
//   if (!parkingArea) {
//     throw new Error("Parking area not found");
//   }

//   const newAvailableSlots = parkingArea.availableSlots + change;
//   if (newAvailableSlots < 0 || newAvailableSlots > parkingArea.totalSlots) {
//     throw new Error("Invalid available slots count");
//   }

//   return await ParkingAreaDTO.findByIdAndUpdate(
//     id,
//     { $set: { availableSlots: newAvailableSlots } },
//     { new: true }
//   );
// }; 