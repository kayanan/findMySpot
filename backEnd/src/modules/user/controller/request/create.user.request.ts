import { ObjectId } from 'mongoose';
import { BankDetail } from '../../data/dtos/user.dto';

export interface UserRequest {
  firstName: string;
  lastName: string;
}

export interface CreateUserRequest extends UserRequest {
  email: string;
  password: string;
  nic:string;
  mobile:string;
  role?: string;
}

export interface UpdateUserRequest extends UserRequest {
  id: string;
  address1?: string;
  address2?: string;
  nic:string;
  city?: ObjectId;
  vehicle:Array<string>;
  phoneNumbe?: string;
  profileImage?: string;
  bankDetails?: Array<BankDetail>;
}

export interface AdminUpdateUserRequest extends UserRequest {
  id: string;
  isPremiumCustomer?: boolean;
  nic:string;
  isVerified?: boolean;
  isAvailability?: boolean;
  isAdvertismentsEnabled?: boolean;
  isActive?: boolean;
  vehicle:Array<string>;
  approvalStatus?: boolean;
  address1?: string;
  address2?: string;
  city?: string;
  profileImage?: string;
  bankDetails?: Array<BankDetail>;
}
