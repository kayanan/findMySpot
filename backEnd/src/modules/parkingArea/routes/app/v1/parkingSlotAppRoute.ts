import { RequestHandler, Router } from "express";
import { deleteSlotHandler, getSlotsByParkingAreaHandler, updateSlotHandler } from "../../../controller/parkingSlot.controller";

const router = Router();


router.get("/parking-area/:id", getSlotsByParkingAreaHandler as RequestHandler);
router.patch("/:id", updateSlotHandler as RequestHandler);
router.delete("/:id", deleteSlotHandler as RequestHandler);

export default router;


