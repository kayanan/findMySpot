import { Router } from 'express';
import {
  roleAdminRouter,
  userAdminRouter,
} from '@/modules';


const adminRouter: Router = Router();


// adminRouter.use('/users', userAdminRouter);
// adminRouter.use('/roles', roleAdminRouter);


export default adminRouter;
