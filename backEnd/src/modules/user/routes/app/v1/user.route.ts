import { Router } from 'express';
import {
  saveUser,
  getUser,
  updateUser,
  checkDuplicateEntry
} from '../../../controller/user.controller';
import { checkToken } from '@/src/middlewares/check-auth';

const userRouter: Router = Router();

// User routes
userRouter.get('/profile/:id', getUser);
userRouter.post('/signup', saveUser);
userRouter.patch('/update/:id', updateUser);
userRouter.post('/check-duplicate-entry', checkDuplicateEntry);

export default userRouter;
