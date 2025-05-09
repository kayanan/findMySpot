import { Request, Response } from 'express';
import { errorResponse } from '../../../utils/common.util';
import UserService from '../service/user.service';
import { LoginResponse } from './response/auth.response';
import {
  BaseResponse,
  CreatedUpdatedResponse,
} from '../../base/controller/responses/base.repsonse';
import { ChangePasswordRequest } from './request/change.password.request';
import { ForgotPasswordRequest } from './request/forgot.password.request';
import {
  UserListResponse,
  UserProfileResponse,
} from './response/user.response';
import { UserJWT } from '../data/dtos/user.jwt.dto';
import {
  AdminUpdateUserRequest,
  CreateUserRequest,
  UpdateUserRequest,
} from './request/create.user.request';
import { UserListRequest } from './request/user.list.request';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const response: UserListResponse = await UserService.getUsers(
      req.query as unknown as UserListRequest
    );
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
    console.log(error)
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const response: UserProfileResponse =
      await UserService.getUser(req.params.id);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const saveUser = async (req: Request, res: Response) => {
  try {
    const response: CreatedUpdatedResponse =
      await UserService.saveUser(
        req.body as unknown as CreateUserRequest
      );
    res.status(201).json(response);
  } catch (error: any) {
     console.log(error.message)
    res.status(400).json(errorResponse(error.message));
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const response: LoginResponse = await UserService.login(req);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const response: BaseResponse = await UserService.forgotPassword(
      req.body as unknown as ForgotPasswordRequest
    );
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const verifyMobileNumberOTP = async (req: Request, res: Response) => {
  try {
    const response: BaseResponse = await UserService.sendOTPForMobilNumberVerification(
      req.query.phoneNumber as string
    );
    res.status(200).json(response);
  } catch (error: any) {
    console.log(error)
    res.status(400).json(errorResponse(error.message));
  }
};


export const changePassword = async (req: Request, res: Response) => {
  try {
    const response: BaseResponse = await UserService.resetPassword(
      req.body as unknown as ChangePasswordRequest
    );
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const updateUser = async (req: any, res: Response) => {
  try {
    const response: CreatedUpdatedResponse =
      await UserService.updateUser(
        req.body as unknown as UpdateUserRequest,
        req.userData as unknown as UserJWT
      );
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const adminUpdateUser = async (
  req: Request,
  res: Response
) => {
  try {
    // Object.keys(req.body).forEach(key => {
    //   if(req.body[key] instanceof Array){
    //     req.body[key].forEach((item,index) => {
    //       if(item.includes("{")){
    //         req.body[key][index] = JSON.parse(item);
    //       }
    //     });
    //   }
    //   else if(req.body[key].includes("{")){
    //     req.body[key] = JSON.parse(req.body[key]);
    //   }
    // });
    
    const response: CreatedUpdatedResponse =
      await UserService.adminUpdateUser(
        req.body as unknown as AdminUpdateUserRequest,
        req.params.id as string
      );
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
    console.log(error)
  }
};

export const approveParkingOwner = async (req: Request, res: Response) => {
  try {
    const response: BaseResponse = await UserService.approveParkingOwner(req.params.id);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const rejectParkingOwner = async (req: Request, res: Response) => {
  try {
    const reason = req.body.reason as string;
    const response: BaseResponse = await UserService.rejectParkingOwner(req.params.id, reason);
    res.status(200).json(response);
  } catch (error: any) {
    console.log(error)
    res.status(400).json(errorResponse(error.message));
  }
};

export const getPendingOwnersCount = async (req: Request, res: Response) => {
  try {
    const response: BaseResponse = await UserService.getPendingOwnersCount();
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};
    