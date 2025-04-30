import { RequestHandler, Router } from "express";
import {  deleteParkingAreaController, getParkingAreaByIdController, getParkingAreasByOwnerIdController, updateParkingAreaController } from "../../../controller/parkingArea.controller";
import { getVehicleTypes } from "@/src/modules/parkingSubscriptionFee/controller/vehicle.controller";

const router = Router();


router.get("/:id", getParkingAreaByIdController as RequestHandler);
router.patch("/:id", updateParkingAreaController as RequestHandler);
router.delete("/:id", deleteParkingAreaController as RequestHandler);
router.get("/types", getVehicleTypes as RequestHandler);
router.get("/owner/:ownerId", getParkingAreasByOwnerIdController as RequestHandler);

export default router;
