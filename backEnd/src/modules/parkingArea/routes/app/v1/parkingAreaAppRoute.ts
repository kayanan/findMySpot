import { RequestHandler, Router } from "express";
import { checkDuplicateEntryController, createParkingAreaController, getParkingAreaByIdController, updateParkingAreaController, getAllParkingAreasController, getParkingAreasByOwnerIdController } from "../../../controller/parkingArea.controller";


const router = Router();
router.get("/", getAllParkingAreasController as RequestHandler);
router.post("/", createParkingAreaController );
router.patch("/:id", updateParkingAreaController as RequestHandler);
router.get("/:id", getParkingAreaByIdController as RequestHandler);
router.post("/check-duplicate-entry", checkDuplicateEntryController as RequestHandler);
router.get("/owner/:ownerId", getParkingAreasByOwnerIdController as RequestHandler);

export default router;