import { RequestHandler, Router } from "express";
import { checkDuplicateEntryController, createParkingAreaController, getParkingAreaByIdController, updateParkingAreaController } from "../../../controller/parkingArea.controller";


const router = Router();
router.post("/", createParkingAreaController );
router.patch("/:id", updateParkingAreaController as RequestHandler);
router.get("/:id", getParkingAreaByIdController as RequestHandler);
router.post("/check-duplicate-entry", checkDuplicateEntryController as RequestHandler);

export default router;