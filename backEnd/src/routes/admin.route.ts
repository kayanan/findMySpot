import { Router } from 'express';
import {roleAdminRouter,userAdminRouter} from '@/modules/user/routes/admin/v1';

import locationAdminRouter from '@/modules/location/routes/admin/v1/index';
import parkingSubscriptionFeeAdminRouter from '@/modules/parkingSubscriptionFee/routes/admin/v1/subscriptionFeeAdminRoute';
import vehicleAdminRouter from '@/modules/parkingSubscriptionFee/routes/admin/v1/vehicleAdminRoute';

const adminRouter: Router = Router();
adminRouter.use('/v1/users', userAdminRouter);
adminRouter.use('/v1/roles', roleAdminRouter);
adminRouter.use('/v1/province', locationAdminRouter.provinceAdminRouter);
adminRouter.use('/v1/district', locationAdminRouter.districtAdminRouter);
adminRouter.use('/v1/city', locationAdminRouter.cityAdminRouter);
adminRouter.use('/v1/parking-subscription-fee', parkingSubscriptionFeeAdminRouter);
adminRouter.use('/v1/vehicle', vehicleAdminRouter);


export default adminRouter;
