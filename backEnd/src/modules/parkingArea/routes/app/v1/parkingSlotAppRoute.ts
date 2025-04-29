import { RequestHandler, Router } from "express";
import { getSlotsByParkingAreaHandler } from "../../../controller/parkingSlot.controller";

const router = Router();

router.get("/", getSlotsByParkingAreaHandler as RequestHandler);

export default router;


