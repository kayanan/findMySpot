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

export const updateSlotByParkingAreaId = async (parkingAreaId: string, slotData: CreateUpdateParkingSlotRequest & { vehicleId: string }) => {
  const slot = await ParkingSlotDTO.updateMany({ parkingAreaId, vehicleType: slotData?.vehicleId }, { $set: slotData });
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

export const getSlotsByParkingArea = async (id: string) => {
  const slots = await ParkingSlotDTO.find({
    parkingAreaId: id,
    isDeleted: { $ne: true }
  }).populate('vehicleType reservationId').lean();
  return slots;
};

export const getSlotByNumberAndArea = async (parkingAreaId: string, slotNumber: number) => {
  return await ParkingSlotDTO.findOne({
    parkingAreaId,
    slotNumber,
    isDeleted: false
  });
};

export const deleteManySlots = async (parkingAreaId: string) => {
  return await ParkingSlotDTO.deleteMany({
    parkingAreaId: parkingAreaId,
    isDeleted: true
  });
};

export const updateParkingSlotStatus = async (parkingAreaId: string[], status: boolean) => {
  return await ParkingSlotDTO.updateMany({
    parkingAreaId: { $in: parkingAreaId },
    isDeleted: false
  }, { $set: { isActive: status } });
};

export const filterParkingSlots = async (filter: any, parkingAreaIds: string[]) => {
  const parkingSlots = await ParkingSlotDTO.aggregate([
    {
      $match: {
        parkingAreaId: { $in: parkingAreaIds },
        isReservationPending: { $ne: true },
        isActive: true,
        isDeleted: { $ne: true }
      }
    },
    {
      $lookup: {
        from: 'vehicles',
        localField: 'vehicleType',
        foreignField: '_id',
        as: 'vehicle'
      },
    },
    {
      $unwind: '$vehicle'
    },
    {
      $match: {
        'vehicle.vehicleType': filter.vehicleType,
        'vehicle.isDeleted': { $ne: true }
      }
    },
    {
      $lookup: {
        from: 'reservations',
        localField: 'reservationId',
        foreignField: '_id',
        as: 'reservation'
      }
    },
    {
      $unwind: {
        path: "$reservation",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $match: {
        $or: [
          { 'reservation.endDateAndTime': { $lt: filter.startTime } },
          { 'reservation': null },
        ],
        ...(filter?.endTime ? { 'reservation.startDateAndTime': { $gt: (filter.endTime) } } : { 'reservation': null }),

      }
    },
    {
      $group: {
        _id: '$parkingAreaId',
        slotCount: { $sum: 1 },
        price: { $first: '$slotPrice' }
      }
    },
    {
      $lookup: {
        from: 'parkingareas',
        localField: '_id',
        foreignField: '_id',
        as: 'parkingArea'
      },
    },
    {
      $unwind: '$parkingArea'
    },
    {
      $project: {
        slotCount: 1,
        price: 1,
        parkingArea: {
          _id: 1,
          name: 1,
          location: 1,
          contactNumber: 1,
          email: 1,
          district: 1,
          city: 1,
          province: 1,
          averageRating: 1,
        }
      }
    }

  ])
  console.log(parkingSlots, "parkingSlots");
  return parkingSlots;
};
