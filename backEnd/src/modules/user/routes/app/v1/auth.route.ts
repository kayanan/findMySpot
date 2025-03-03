import { Router } from 'express';
import {
  login,
  sendOTP,
  changePassword,
} from '../../../controller/user.controller';

const authRouter: Router = Router();

// Auth routes
authRouter.post('/login', login);
authRouter.post('/password/reset/otp', sendOTP);
authRouter.post('/password/reset', changePassword);

export default authRouter;
