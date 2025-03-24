import mongoose from 'mongoose';
import HelperUtil from '../../../../utils/helper.util';
import { UserDTO, UserModel } from '../dtos/user.dto';
import { UserListRequest } from '../../controller/request/user.list.request';
import { UserListResponse } from '../../controller/response/user.response';
import {
  AdminUpdateUserRequest,
  CreateUserRequest,
  UpdateUserRequest,
} from '../../controller/request/create.user.request';

async function findUsers(
  listReq: UserListRequest
): Promise<UserListResponse> {
  const query = { isDeleted: false } as any;
  if (listReq.search) {
    query.$or = [
      {
        firstName: {
          $regex: '.*' + listReq.search ? listReq.search : '.*',
          $options: 'i',
        },
      },
      {
        lastName: {
          $regex: '.*' + listReq.search ? listReq.search : '.*',
          $options: 'i',
        },
      },
      {
        email: {
          $regex: '.*' + listReq.search ? listReq.search : '.*',
          $options: 'i',
        },
      },
    ];
  }
  
  if (listReq.approvalStatus != null) {
    query.approvalStatus = listReq.approvalStatus;
  }
  if (listReq.isActive != null) {
    query.isActive = listReq.isActive;
  }
  if (listReq.isVerified != null) {
    query.isVerified = listReq.isVerified;
  }
  if (listReq.role) {
    query.role = listReq.role;
  }
  const total = await findTotalUsers(query);
  const users = await UserDTO.find(query)
    .populate('role', '_id type')
    .select('-password -__v')
    .skip(
      HelperUtil.pageSkip(
        listReq.skip ?? 0,
        listReq.limit ?? Number(process.env.PAGINATION_LIMIT)
      )
    )
    .limit(listReq.limit ?? Number(process.env.PAGINATION_LIMIT));
  return { total, users };
}

async function saveUser(
  userPayload: CreateUserRequest
  
): Promise<string | null> {
  const newUser = new UserDTO(userPayload);
  newUser.isActive = true;
  newUser.isVerified = true;
  const { _id } = await newUser.save();
  return _id as string;
}

async function findById(id: string): Promise<UserModel | null> {
  const user: UserModel | null = await UserDTO.findById(id, {
    isDeleted: false,
  })
    .populate('role', '_id type')
    .select('-password -__v');
  return user as UserModel;
}

async function findByEmail(email: string): Promise<UserModel | null> {
  //make sure to delete the password attribute before return to the api calls.
  return UserDTO.findOne({
    email,
    isDeleted: false,
  });
}

// send the password reset otp
async function setPasswordResetOtp(userId: string): Promise<string> {
  const otp = HelperUtil.generateOtp();
  const updated = await UserDTO.updateOne(
    {
      _id: userId,
    },
    {
      otp: `${otp}`,
      otpExpiresAt: HelperUtil.addMinute(
        Number(process.env.OTP_EXPIRES_MINUTE)
      ),
    }
  );
  if (updated.acknowledged && updated.modifiedCount > 0) {
    return `${otp}`;
  } else {
    throw new Error(`Failed to generate the otp.`);
  }
}

async function findTotalUsers(query: any): Promise<number> {
  return UserDTO.countDocuments(query);
}

// reset the otp once the password is changed
async function resetPasswordResetOtp(
  userId: string
): Promise<boolean> {
  const updated = await UserDTO.updateOne(
    {
      _id: userId,
    },
    {
      otp: null,
      otpExpiresAt: null,
    }
  );
  if (updated.acknowledged && updated.modifiedCount > 0) {
    return true;
  } else {
    return false;
  }
}

async function changePassword(
  id: string,
  email: string,
  password: string
): Promise<boolean> {
  try {
    //we cannot use `updateOne`, we have to use save() otherwise it's not gonna trigger the `pre` hook.
    //which contains the password hashing code.
    const user = await UserDTO.findOne({
      _id: new mongoose.Types.ObjectId(id),
      email: email,
      isActive: true,
      isDeleted: false,
    });
    if (user) {
      user.password = password;
      const result = await user?.save();
      return result != null;
    } else {
      throw Error(`User is not found.`);
    }
  } catch (e) {
    throw e as Error;
  }
}

async function updateUser(
  userPayload: UpdateUserRequest,
  userId: string
): Promise<string | null> {
  const updateUser = (await UserDTO.findOneAndUpdate(
    { _id: userId },
    userPayload,
    {
      new: true,
    }
  )) as unknown as UpdateUserRequest;

  return updateUser.id;
}

async function adminUpdateUser(
  userPayload: AdminUpdateUserRequest,
  userId: string
): Promise<string | null> {
  const adminUpdateUser = (await UserDTO.findOneAndUpdate(
    { _id: userId },
    userPayload,
    {
      new: true,
    }
  )) as unknown as AdminUpdateUserRequest;
  return adminUpdateUser.id;
}

async function findByRole(role: string): Promise<UserModel | null> {
  const user = await UserDTO.findOne({
    role,
    isDeleted: false,
  });
  return user;
}

async function softDeleteById(id: string): Promise<UserModel | null> {
  const user: UserModel | null = await UserDTO.findById(id);
  if (!user) {
    return null;
  }
  user.isDeleted = true;
  await user.save();

  return user;
}

export default {
  findUsers,
  saveUser,
  findById,
  findByEmail,
  setPasswordResetOtp,
  findTotalUsers,
  resetPasswordResetOtp,
  changePassword,
  updateUser,
  adminUpdateUser,
  findByRole,
  softDeleteById,
};
