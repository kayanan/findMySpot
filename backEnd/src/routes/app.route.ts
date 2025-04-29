import { Router } from "express";
import locationAppRoute from "@/modules/location/routes/app/v1/index";
import { authRouter, userRouter } from "@/modules/user/routes/app/v1";
import parkingSubscriptionFeeAppRoute from "@/modules/parkingSubscriptionFee/routes/app/v1/appRoute";
import vehicleAppRoute from "@/modules/parkingSubscriptionFee/routes/app/v1/vehicleAppRoute";
// import parkingSlotAppRoute from "@/modules/parkingArea/routes/app/v1/parkingSlotAppRoute";
// import parkingAreaAppRoute from "@/modules/parkingArea/routes/app/v1/parkingAreaAppRoute";
const appRouter: Router = Router();
 appRouter.use('/v1/user', userRouter);
 appRouter.use('/v1/auth', authRouter);
appRouter.use("/v1/province",locationAppRoute.provinceAppRouter);
appRouter.use("/v1/district",locationAppRoute.districtAppRouter);
appRouter.use("/v1/city",locationAppRoute.cityAppRouter);
appRouter.use("/v1/parking-subscription-fee",parkingSubscriptionFeeAppRoute);
appRouter.use("/v1/vehicle",vehicleAppRoute);
// appRouter.use("/v1/parking-slot",parkingSlotAppRoute);
// appRouter.use("/v1/parking-area",parkingAreaAppRoute);

export default appRouter;
