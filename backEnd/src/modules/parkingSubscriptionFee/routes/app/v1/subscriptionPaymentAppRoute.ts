import { Router } from "express";
import { createSubscriptionPaymentController, getSubscriptionPaymentByParkingAreaIdController } from "../../../controller/subscriptionPayment.controller";

const router = Router();
router.post("/", createSubscriptionPaymentController as any);
router.get("/parking-area/:id", getSubscriptionPaymentByParkingAreaIdController);

export default router;