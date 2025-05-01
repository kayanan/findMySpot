import { CreateUpdateParkingSlotRequest } from "../controller/request/create.parkingSlot.request";
import { ParkingSlotDTO } from "../data/dtos/parkingSlot.dto";


export const createSlot = async (slotData: Partial<CreateUpdateParkingSlotRequest>[]) => {
  const slots = Array.isArray(slotData) ? slotData : [slotData];
  const result = await ParkingSlotDTO.insertMany(slots, { rawResult: true });
  return result;
};

export const updateSlot = async (id: string, slotData: CreateUpdateParkingSlotRequest) => {
  const slot = await ParkingSlotDTO.findByIdAndUpdate(
    id,
    { $set: slotData },
    { new: true }
  );
  if (!slot) {
    throw new Error("Slot not found");
  }
  return slot;
};

export const deleteSlot = async (id: string) => {
  const slot = await ParkingSlotDTO.findByIdAndUpdate(
    id,
    { $set: { isDeleted: true } },
    { new: true }
  );
  if (!slot) {
    throw new Error("Slot not found");
  }
  return slot;
};

export const getSlotById = async (id: string) => {
  return await ParkingSlotDTO.findOne({ _id: id, isDeleted: false });
};

export const getAllSlots = async () => {
  return await ParkingSlotDTO.find({ isDeleted: false });
};

export const getActiveSlots = async () => {
  return await ParkingSlotDTO.find({ isActive: true, isDeleted: false });
};

export const getSlotsByParkingArea = async (parkingAreaId: string) => {
  return await ParkingSlotDTO.find({
    parkingAreaId,
    isDeleted: false
  }).populate('vehicleType');
};

export const getSlotByNumberAndArea = async (parkingAreaId: string, slotNumber: number) => {
  return await ParkingSlotDTO.findOne({
    parkingAreaId,
    slotNumber,
    isDeleted: false
  });
};

export const deleteManySlots = async (parkingAreaId: string ) => {
  return await ParkingSlotDTO.deleteMany({
    parkingAreaId: parkingAreaId ,
    isDeleted: true
  });
};

export const updateParkingSlotStatus = async (parkingAreaId: string[], status: boolean) => {
  return await ParkingSlotDTO.updateMany({
    parkingAreaId: {$in: parkingAreaId} ,
    isDeleted: false
  }, { $set: { isActive: status } });
};
