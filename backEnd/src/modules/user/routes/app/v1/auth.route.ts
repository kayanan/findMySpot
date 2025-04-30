import { Router } from 'express';
import {
  login,
  sendOTP,
  changePassword,
  verifyMobileNumberOTP,
} from '../../../controller/user.controller';

const authRouter: Router = Router();

// Auth routes
authRouter.post('/login', login);
authRouter.post('/password/reset/otp', sendOTP);
authRouter.post('/password/reset', changePassword);
authRouter.get('/verify-mobile-number', verifyMobileNumberOTP);
export default authRouter;
