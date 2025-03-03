import { Router } from 'express';
import locationAdminRouter from '@/modules/location/routes/admin/v1/index';


const adminRouter: Router = Router();


adminRouter.use('/province', locationAdminRouter.provinceAdminRouter);
adminRouter.use('/district', locationAdminRouter.districtAdminRouter);
adminRouter.use('/city', locationAdminRouter.cityAdminRouter);


export default adminRouter;
