import { Router } from "express";
import locationAppRoute from "@/modules/location/routes/app/v1/index";
import { authRouter, userRouter } from "@/modules/user/routes/app/v1";
import parkingSubscriptionFeeAppRoute from "@/modules/parkingSubscriptionFee/routes/app/v1/appRoute";
import vehicleAppRoute from "@/modules/parkingSubscriptionFee/routes/app/v1/vehicleAppRoute";
const appRouter: Router = Router();
 appRouter.use('/v1/user', userRouter);
 appRouter.use('/v1/auth', authRouter);
appRouter.use("/v1/province",locationAppRoute.provinceAppRouter);
appRouter.use("/v1/district",locationAppRoute.districtAppRouter);
appRouter.use("/v1/city",locationAppRoute.cityAppRouter);
appRouter.use("/v1/parking-subscription-fee",parkingSubscriptionFeeAppRoute);
appRouter.use("/v1/vehicle",vehicleAppRoute);

export default appRouter;
