import { RequestHandler, Router } from "express";
import { createParkingAreaController, getParkingAreaByIdController, updateParkingAreaController } from "../../../controller/parkingArea.controller";


const router = Router();
router.post("/", createParkingAreaController );
router.patch("/:id", updateParkingAreaController as RequestHandler);
router.get("/:id", getParkingAreaByIdController as RequestHandler);

export default router;