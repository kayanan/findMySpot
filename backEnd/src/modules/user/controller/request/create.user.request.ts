import { BankDetail } from '../../data/dtos/user.dto';

export interface UserRequest {
  firstName: string;
  lastName: string;
}

export interface CreateUserRequest extends UserRequest {
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserRequest extends UserRequest {
  id: string;
  address1?: string;
  address2?: string;
  city?: string;
  phoneNumbe?: string;
  facebookId?: string;
  googleId?: string;
  profileImage?: string;
  bankDetails?: Array<BankDetail>;
}

export interface AdminUpdateUserRequest extends UserRequest {
  id: string;
  isPremiumCustomer?: boolean;
  isVerified?: boolean;
  isAvailability?: boolean;
  isAdvertismentsEnabled?: boolean;
  isActive?: boolean;
  approvalStatus?: boolean;
  address1?: string;
  address2?: string;
  city?: string;
  phoneNumber?: string;
  facebookId?: string;
  googleId?: string;
  profileImage?: string;
  bankDetails?: Array<BankDetail>;
}
