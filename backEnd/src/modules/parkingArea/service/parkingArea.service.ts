import {
    createParkingArea as createParkingAreaRepo,
    updateParkingArea as updateParkingAreaRepo,
    deleteParkingArea as deleteParkingAreaRepo,
    getParkingAreaById as getParkingAreaByIdRepo,
    getAllParkingAreas as getAllParkingAreasRepo,
    getActiveParkingAreas as getActiveParkingAreasRepo,
    getParkingAreasByOwnerId as getParkingAreasByOwnerIdRepo,
    updateParkingAreaByOwnerId as updateParkingAreaByOwnerIdRepo,
    deleteParkingAreaByOwnerId as deleteParkingAreaByOwnerIdRepo,
} from "../repository/parkingArea.repository";
import { validateCreateParkingArea, validateUpdateParkingArea } from "../validators/parkingArea.validator";
import { CreateUpdateParkingAreaRequest } from "../controller/request/ceate.parkingArea.request";
import { ParkingAreaModel } from "../data/dtos/parkingArea.dto";
import { createSlot, getSlotsByParkingArea as getSlotsByParkingAreaRepo} from "./parkingSlot.service";
import { CreateUpdateParkingSlotRequest } from "../controller/request/create.parkingSlot.request";
import { updateParkingSlotStatus } from "./parkingSlot.service";
import { sendSMS } from "../../base/services/sms.service";
import UserRepository from "../../user/data/repository/user.repository";
import { BaseResponse } from "../../base/controller/responses/base.repsonse";
import { ParkingSlotDTO } from "../data/dtos/parkingSlot.dto";
export const createParkingArea = async (parkingAreaData: Partial<CreateUpdateParkingAreaRequest & { longitude: number, latitude: number, slot: { type: string, count: number }[] }>) => {
    const { error } = validateCreateParkingArea(parkingAreaData);
    if (error) {
        throw new Error(error.message);
    }
    parkingAreaData.location = {
        type: "Point",
        coordinates: [Number(parkingAreaData.longitude), Number(parkingAreaData.latitude)],
    };
    delete parkingAreaData.longitude;
    delete parkingAreaData.latitude;
    const slot = parkingAreaData?.slot;
    delete parkingAreaData?.slot;
    parkingAreaData.isActive = false;
    const parkingArea = await createParkingAreaRepo(parkingAreaData as unknown as ParkingAreaModel);
    const parkingAreaId = parkingArea._id as string;
    if (slot) {
        const slotData = slot.filter((item) => Number(item.count) > 0).map((item) => ({
            slotDetails: {
                vehicleType: item.type,
                isActive: false,
                isDeleted: false,
            } as Partial<CreateUpdateParkingSlotRequest>,
            count: item.count as number,
            parkingAreaId: parkingAreaId,
        }));
        await createSlot(slotData);
    }
    const owner = await UserRepository.findById(
        parkingArea.ownerId as unknown as string
    );
    const message = `Your request to create a parking area has been successfully submitted. Please wait for approval. Once approved, you can start using it by logging in with your email and password.`;
    await sendSMS(owner?.phoneNumber as string, message);
    return parkingArea;
};

export const updateParkingArea = async (id: string, parkingAreaData: CreateUpdateParkingAreaRequest) => {
    const { error } = validateUpdateParkingArea(parkingAreaData);
    if (error) {
        throw new Error(error.message);
    }
    return await updateParkingAreaRepo(id, parkingAreaData as unknown as ParkingAreaModel);
};
export const updateParkingAreaByOwnerId = async (ownerId: string, data: Partial<ParkingAreaModel>) => {

    await updateParkingAreaByOwnerIdRepo(ownerId, data);
    const parkingArea = await getParkingAreasByOwnerIdRepo(ownerId);
    const parkingAreaIds = parkingArea.map((item) => item._id as string);


    await updateParkingSlotStatus(parkingAreaIds as string[], data.isActive as boolean);
    return parkingArea;
};

export const deleteParkingArea = async (id: string) => {
    return await deleteParkingAreaRepo(id);
};

export const getParkingAreaById = async (id: string) => {
    return await getParkingAreaByIdRepo(id);
};

export const getAllParkingAreas = async () => {
    return await getAllParkingAreasRepo();
};

export const getActiveParkingAreas = async () => {
    return await getActiveParkingAreasRepo();
};

export const getParkingAreasByOwnerId = async (ownerId: string) => {
    const parkingAreas = await getParkingAreasByOwnerIdRepo(ownerId);
    const parkingAreasWithSlots = await Promise.all(parkingAreas.map(async (parkingArea) => {
        const parkingSlots = await getSlotsByParkingAreaRepo(parkingArea._id as string);
        return { ...parkingArea, slots: parkingSlots };
    }));
    return parkingAreasWithSlots;
};
export const deleteParkingAreaByOwnerId = async (ownerId: string) => {
    const parkingAreas = await getParkingAreasByOwnerIdRepo(ownerId);
    if (parkingAreas.length === 0) {
        throw new Error("Parking area not found");
    }
    const parkingAreaIds = parkingAreas.map((parkingArea) => parkingArea._id as string);
    await ParkingSlotDTO.deleteMany({ parkingAreaId: { $in: parkingAreaIds } });
    await deleteParkingAreaByOwnerIdRepo(ownerId);
   
    return { status: true, message: 'Parking area deleted successfully' } as BaseResponse;
};

// export const getParkingAreaByLocation = async (longitude: number, latitude: number) => {
//   return await getParkingAreaByLocationRepo(longitude, latitude);
// };
