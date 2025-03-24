import UserRepository from '../data/repository/user.repository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../data/dtos/user.dto';
import { sendSMS } from '../../base/services/sms.service';
//import * as EmailService from '../../base/services/email.service';
//import { EmailTemplateType } from '@/modules/base/enums/email.template.type';
import { ChangePasswordRequest } from '../controller/request/change.password.request';
import UserValidator from '../validators/user.validator';
import {
  BaseResponse,
  CreatedUpdatedResponse,
} from '../../base/controller/responses/base.repsonse';
import { ForgotPasswordRequest } from '../controller/request/forgot.password.request';
import {
  UserListResponse,
  UserProfileResponse,
} from '../controller/response/user.response';
import { LoginResponse } from '../controller/response/auth.response';
import { UserJWT } from '../data/dtos/user.jwt.dto';

import {
  CreateUserRequest,
  UpdateUserRequest,
  AdminUpdateUserRequest,
} from '../controller/request/create.user.request';
import { UserListRequest } from '../controller/request/user.list.request';
import { isValidObjectId } from 'mongoose';
//import AssetService from '../../asset/service/asset.service';
import BaseRepository from '@/modules/base/data/repository/base.repository';
import { RoleDTO } from '@/modules/user/data/dtos/role.dto';

const getUsers = async (
  listReq: UserListRequest
): Promise<UserListResponse> => {
  const list: UserListResponse =
    await UserRepository.findUsers(listReq);
  // for (let user of list.users) {
  //   user.profileImage = user.profileImage?.toString();
  //   // if (user.profileImage) {
  //   //   const url = await AssetService.getAssetUrl(user?.profileImage);
  //   //   if (url !== null) {
  //   //     user = { ...user, profileImage: url } as UserModel;
  //   //   }
  //   // }
  // }
  return {
    status: true,
    totalCount: list.total,
    users: list.users,
  } as UserListResponse;
};

const getUser = async (req: any): Promise<UserProfileResponse> => {
  const user: UserModel | null = await UserRepository.findById(
    req.userData.userId
  );

  if (user === null) {
    throw new Error('User not found');
  }
  user;
  // if (user.profileImage) {
  //   const url = await AssetService.getAssetUrl(user?.profileImage);
  //   console.log(url);
  //   if (url !== null) {
  //     console.log(typeof url);
  //     user.profileImage = url;
  //   }
  // }
  return { status: true, user } as UserProfileResponse;
};

const saveUser = async (
  createUserRequest: CreateUserRequest
): Promise<CreatedUpdatedResponse> => {
 
  const valResult =
    UserValidator.saveUserValidator(createUserRequest);
  if (valResult.error) throw new Error(valResult.error.message);
  const checkUser = await UserRepository.findByEmail(
    createUserRequest.email
  );
  if (checkUser !== null) throw new Error('User already exists');
  const id: string | null =
    await UserRepository.saveUser(createUserRequest);
  if (id != null) {
    return { status: true, id } as CreatedUpdatedResponse;
  }
  
  throw new Error('User not inserted');
};

const login = async (req: any) => {
  const valResult = UserValidator.loginValidator({
    email: req.body.email,
    password: req.body.password,
  });
  if (valResult.error) throw new Error(valResult.error.message);

  const checkUser = await UserRepository.findByEmail(req.body.email);
  if (checkUser == null) throw new Error('User not found');

  const compareRes: boolean = await bcrypt.compare(
    req.body.password,
    checkUser.password
  );
  const role = await BaseRepository.findById(
    RoleDTO,
    checkUser.role.toString()
  );
  if (role == null) throw new Error('Role not found');

  if (compareRes) {
    const token = jwt.sign(
      {
        firstName: checkUser.firstName,
        lastName: checkUser.lastName,
        email: checkUser.email,
        userId: checkUser._id,
        role: role.type,
      },
      process.env.SECRET!,
      {
        expiresIn: '6h',
      }
    );
    return {
      status: true,
      firstName: checkUser.firstName,
      lastName: checkUser.lastName,
      email: checkUser.email,
      userId: checkUser._id!.toString(),
      role: role.type,
      accessToken: token,
    } as LoginResponse;
  }
  throw new Error('Invalid credentials');
};

const forgotPassword = async (
  forgotPasswordRequest: ForgotPasswordRequest
): Promise<BaseResponse> => {

  if (forgotPasswordRequest.email == null)
    throw new Error('Email not found');
  const user = await UserRepository.findByEmail(
    forgotPasswordRequest.email
  );
  if (user === null) throw new Error('User not found');
  const otp = await UserRepository.setPasswordResetOtp(
    user._id!.toString()
  );
  // const emailSent = await EmailService.send(
  //   user?.email ?? '',
  //   EmailTemplateType.forgotPassword,
  //   {
  //     expiresIn: process.env.OTP_EXPIRES_HOURS,
  //     otp,
  //     name: user.firstName,
  //   }
  // );
  const smsSent=await sendSMS(otp,user?.phoneNumber!);
  if (smsSent) throw new Error('SMS not sent');

  return {
    status: true,
    message: 'OTP sent successfully',
  } as BaseResponse;
};

const resetPassword = async (
  changePasswordRequest: ChangePasswordRequest
): Promise<BaseResponse> => {
  const valResult = UserValidator.resetPasswordValidator({
    email: changePasswordRequest.email,
    password: changePasswordRequest.password,
    otp: changePasswordRequest.otp,
  });
  if (valResult.error) throw new Error(valResult.error.message);

  const user = await UserRepository.findByEmail(
    changePasswordRequest.email
  );
  if (user === null) throw new Error('User not found');

  const diff =
    new Date().getTime() -
    (user?.otpExpiresAt ?? new Date()).getTime();
  if (diff > 0) {
    throw new Error('OTP Expired');
  }
  const passwordChanged = await UserRepository.changePassword(
    user._id!.toString(),
    changePasswordRequest.email,
    changePasswordRequest.password
  );
  if (!passwordChanged)
    throw new Error('Error while updating the password');
  // const emailSent = await EmailService.send(
  //   user.email ?? '',
  //   EmailTemplateType.changePassword,
  //   {
  //     name: user.firstName,
  //   }
  // );
  // if (!emailSent) throw new Error('Email not sent');
  const resetOTP = await UserRepository.resetPasswordResetOtp(
    user._id!.toString()
  );
  if (!resetOTP) throw new Error('OTP not reset');
  return {
    status: true,
    message: 'Password reset success',
  } as BaseResponse;
};

const updateUser = async (
  updateUserRequest: UpdateUserRequest,
  userData: UserJWT
): Promise<CreatedUpdatedResponse> => {
  const valResult =
    UserValidator.updateUserValidator(updateUserRequest);
  if (valResult.error) throw new Error(valResult.error.message);
  const id: string | null = await UserRepository.updateUser(
    updateUserRequest,
    userData.userId
  );
  if (id != null) {
    return { status: true, id } as CreatedUpdatedResponse;
  }
  throw new Error('User not Updated');
};

const adminUpdateUser = async (
  adminUpdateUserRequest: AdminUpdateUserRequest
): Promise<CreatedUpdatedResponse> => {
  const valResult = UserValidator.adminUpdateUserValidator(
    adminUpdateUserRequest
  );
  if (valResult.error) throw new Error(valResult.error.message);

  const id: string | null = await UserRepository.adminUpdateUser(
    adminUpdateUserRequest,
    adminUpdateUserRequest.id
  );
  if (id != null) {
    return { status: true, id } as CreatedUpdatedResponse;
  }
  throw new Error('User not Updated');
};

export default {
  getUsers,
  getUser,
  saveUser,
  login,
  forgotPassword,
  resetPassword,
  updateUser,
  adminUpdateUser,
};
