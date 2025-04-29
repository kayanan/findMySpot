import { addressSchema } from "@/modules/parkingArea/data/dtos/parkingArea.dto";
import { ObjectId } from "mongoose";
export interface CreateUpdateParkingAreaRequest {
    id?: String | ObjectId;
    name: string;
    location: {
        type: string;
        coordinates: number[];
    };
    ownerId: string | ObjectId;
    contactNumber: string;
    email: string;
    images: string[];
    description: string;
    address: typeof addressSchema;
    fee: number;
    isActive: boolean;
    isDeleted: boolean;
   
  
  }
  
  export interface ParkingAreaListRequest {
    search?: string;
    skip?: number;
    limit?: number;
  }