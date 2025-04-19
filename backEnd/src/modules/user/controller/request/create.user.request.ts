import { ObjectId } from 'mongoose';
import { CardDetail } from '../../data/dtos/user.dto';

export interface UserRequest {
  firstName?: string;
  lastName?: string;
}

export interface CreateUserRequest extends UserRequest {
  email?: string;
  password?: string;
  nic?:string;
  phoneNumber?:string;
  role?: ObjectId;
}

export interface UpdateUserRequest extends UserRequest {
  id?: string;
  address1?: string;
  address2?: string;
  city?: ObjectId;
  isActive?: boolean;
  isVerified?: boolean;
  isDeleted?: boolean;
  vehicle?:Array<string>;
  phoneNumbe?: string;
  profileImage?: string;
  bankDetails?: Array<CardDetail>;
}

export interface AdminUpdateUserRequest extends UserRequest {
  id: string;
  isPremiumCustomer?: boolean;
  nic:string;
  isVerified?: boolean;
  isAvailability?: boolean;
  isAdvertismentsEnabled?: boolean;
  isActive?: boolean;
  vehicle:Array<{number:string,isDefault:boolean}>;
  approvalStatus?: boolean;
  address1?: string;
  address2?: string;
  city?: string;
  profileImage?: string;
  bankDetails?: Array<CardDetail>;
}
