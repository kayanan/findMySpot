import { Router } from "express";
import locationAppRoute from "../modules/location/routes/app/v1/index";
import { authRouter, userRouter } from '@/modules/user/routes/app/v1';

const appRouter: Router = Router();
 appRouter.use('/v1/user', userRouter);
 appRouter.use('/v1/auth', authRouter);
appRouter.use("/province",locationAppRoute.provinceAppRouter);
appRouter.use("/district",locationAppRoute.districtAppRouter);
appRouter.use("/city",locationAppRoute.cityAppRouter);

export default appRouter;
