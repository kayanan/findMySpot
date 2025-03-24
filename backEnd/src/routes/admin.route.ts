import { Router } from 'express';
import {roleAdminRouter,userAdminRouter} from '@/modules/user/routes/admin/v1';

import locationAdminRouter from '@/modules/location/routes/admin/v1/index';


const adminRouter: Router = Router();

adminRouter.use('/v1/users', userAdminRouter);
adminRouter.use('/v1/roles', roleAdminRouter);
adminRouter.use('/province', locationAdminRouter.provinceAdminRouter);
adminRouter.use('/district', locationAdminRouter.districtAdminRouter);
adminRouter.use('/city', locationAdminRouter.cityAdminRouter);


export default adminRouter;
