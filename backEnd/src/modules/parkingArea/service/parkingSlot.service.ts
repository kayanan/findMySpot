import { ParkingSlotValidator } from "../validators/parkingSlot.validator";
import {
  createSlot as createSlotRepo,
  updateSlot as updateSlotRepo,
  deleteSlot as deleteSlotRepo,
  getSlotById as getSlotByIdRepo,
  getAllSlots as getAllSlotsRepo,
  getActiveSlots as getActiveSlotsRepo,
  getSlotsByParkingArea as getSlotsByParkingAreaRepo,
  getSlotByNumberAndArea as getSlotByNumberAndAreaRepo,
  deleteManySlots as deleteManySlotsRepo,
} from "../repository/parkingSlot.repository";
import { CreateUpdateParkingSlotRequest } from "../controller/request/create.parkingSlot.request";

export const createSlot = async (slotData: { slotDetails: Partial<CreateUpdateParkingSlotRequest>, count: number, parkingAreaId: string }[]) => {
  const { error } = ParkingSlotValidator.createSlotValidator(slotData.map((item) => item.slotDetails));
  if (error) {
    throw new Error(error.message);
  }
  const slots = Array.isArray(slotData) ? slotData : [slotData];
  const slotList: Partial<CreateUpdateParkingSlotRequest>[] = [];
  slots.forEach(async (slot) => {
    for (let i = 0; i < slot.count; i++) {
      const slotData = {
        ...slot.slotDetails,
        slotNumber: i + 1,
        parkingAreaId: slot.parkingAreaId,
        isActive: false,
        isDeleted: false,
      };
      slotList.push(slotData);
    }
  });
  const result = await createSlotRepo(slotList);
  

  return result;
};

export const updateSlot = async (id: string, slotData: CreateUpdateParkingSlotRequest) => {
  const { error } = ParkingSlotValidator.updateSlotValidator(slotData);
  if (error) {
    throw new Error(error.message);
  }
  return await updateSlotRepo(id, slotData);
};

export const deleteSlot = async (id: string) => {
  const slot = await deleteSlotRepo(id);
  return slot;
};

export const getSlotById = async (id: string) => {
  return await getSlotByIdRepo(id);
};

export const getAllSlots = async () => {
  return await getAllSlotsRepo();
};

export const getActiveSlots = async () => {
  return await getActiveSlotsRepo();
};

export const getSlotsByParkingArea = async (parkingAreaId: string) => {
  return await getSlotsByParkingAreaRepo(parkingAreaId);
};

export const deleteManySlots = async (parkingAreaId: string) => {
  return await deleteManySlotsRepo(parkingAreaId);
};
