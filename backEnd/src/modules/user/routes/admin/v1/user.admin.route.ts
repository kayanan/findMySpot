import { Router } from 'express';
import {
  getUsers,
  adminUpdateUser,
} from '../../../controller/user.controller';
import { checkAdmin, checkToken } from '@/src/middlewares/check-auth';

const userAdminRouter: Router = Router();

// User routes
userAdminRouter.get('/list', checkToken, checkAdmin, getUsers);
userAdminRouter.post(
  '/update',
  checkToken,
  checkAdmin,
  adminUpdateUser
);

export default userAdminRouter;
