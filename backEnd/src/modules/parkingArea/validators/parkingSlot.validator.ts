import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const createSlotValidator = (data: any) => {
  const schema = z.array(z.object({
    parkingAreaId: z.string(),
    slotNumber: z.number(),
    slotType: z.string(),
    slotDescription: z.string().optional(),
    slotImage: z.string().optional(),
    slotSize: z.number().optional(),
  vehicleType: z.string(),
}));

return schema.safeParse(data);
};


const updateSlotValidator = (data: any) => {
  const schema = z.object({
    parkingAreaId: z.string().optional(),
    slotNumber: z.number().optional(),
    slotType: z.string().optional(),
    slotDescription: z.string().optional(),
    slotImage: z.string().optional(),
    slotSize: z.number().optional(),
    vehicleType: z.string().optional(),
  }); 

return schema.safeParse(data);
};

export const ParkingSlotValidator = {
  createSlotValidator,
  updateSlotValidator
};