import { Router } from "express";
import locationAppRoute from "../modules/location/routes/app/v1/index"

const appRouter: Router = Router();

appRouter.use("/province",locationAppRoute.provinceAppRouter);
appRouter.use("/district",locationAppRoute.districtAppRouter);
appRouter.use("/city",locationAppRoute.cityAppRouter);

export default appRouter;
