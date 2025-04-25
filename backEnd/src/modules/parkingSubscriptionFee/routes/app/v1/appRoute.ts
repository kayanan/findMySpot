import { RequestHandler, Router } from "express";
import { getFeeForVehicleHandler, getVehicleTypesHandler } from "../../../controller/parkingSubscriptionFee.controller";

const router = Router();

router.get("/vehicle-types", getVehicleTypesHandler);
router.get("/fee-for-vehicle", getFeeForVehicleHandler as RequestHandler);

export default router;


