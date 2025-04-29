import {
    createParkingArea as createParkingAreaRepo,
    updateParkingArea as updateParkingAreaRepo,
    deleteParkingArea as deleteParkingAreaRepo,
    getParkingAreaById as getParkingAreaByIdRepo,
    getAllParkingAreas as getAllParkingAreasRepo,
    getActiveParkingAreas as getActiveParkingAreasRepo,
} from "../repository/parkingArea.repository";
import { validateCreateParkingArea, validateUpdateParkingArea } from "../validators/parkingArea.validator";
import { CreateUpdateParkingAreaRequest } from "../controller/request/ceate.parkingArea.request";
import { ParkingAreaModel } from "../data/dtos/parkingArea.dto";
import { createSlot } from "./parkingSlot.service";
import { CreateUpdateParkingSlotRequest } from "../controller/request/create.parkingSlot.request";
export const createParkingArea = async (parkingAreaData: Partial<CreateUpdateParkingAreaRequest & { longitude: number, latitude: number ,slot: { type: string, count: number }[]}>) => {
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
    const parkingArea = await createParkingAreaRepo(parkingAreaData as unknown as ParkingAreaModel);
    if (slot) {
        const slotData = slot.map((item) => ({
            slotDetails: {
                slotType: item.type,
                isActive: false,
                isDeleted: false,
            } as Partial<CreateUpdateParkingSlotRequest>,
            count: item.count as number,
            parkingAreaId: parkingArea._id as string,
        }));
        await createSlot(slotData);
    }
    return parkingArea;
};

export const updateParkingArea = async (id: string, parkingAreaData: CreateUpdateParkingAreaRequest) => {
    const { error } = validateUpdateParkingArea(parkingAreaData);
    if (error) {
        throw new Error(error.message);
    }
    return await updateParkingAreaRepo(id, parkingAreaData as unknown as ParkingAreaModel);
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

// export const getParkingAreaByLocation = async (longitude: number, latitude: number) => {
//   return await getParkingAreaByLocationRepo(longitude, latitude);
// };
