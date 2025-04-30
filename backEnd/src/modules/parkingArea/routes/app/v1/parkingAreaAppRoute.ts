import { RequestHandler, Router } from "express";
import { createParkingAreaController } from "../../../controller/parkingArea.controller";


const router = Router();
router.post("/", createParkingAreaController )

export default router;