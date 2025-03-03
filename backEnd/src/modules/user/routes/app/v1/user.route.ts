import { Router } from 'express';
import {
  saveUser,
  getUser,
  updateUser,
} from '../../../controller/user.controller';
import { checkToken } from '@/src/middlewares/check-auth';

const userRouter: Router = Router();

// User routes
userRouter.get('/profile', checkToken, getUser);
userRouter.post('/signup', saveUser);
userRouter.post('/update', checkToken, updateUser);

export default userRouter;
