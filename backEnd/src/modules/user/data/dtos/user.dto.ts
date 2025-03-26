import mongoose, { ObjectId, Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { BaseDTO } from '../../../base/data/dtos/base.dto';

export interface UserModel extends BaseDTO {
   firstName: string;
   lastName: string;
   nic: string;
   email: string;
   password: string;
   role: ObjectId;
   address1?: string;
   address2?: string;
   city?: ObjectId;
   phoneNumber?: string;
   otp?: string;
   otpExpiresAt?: Date;
   profileImage?: string;
   isVerified?: boolean;
   isPremiumCustomer?: boolean;
   isActive?: boolean;
   approvalStatus?: boolean;
   vehicle: Array<String>;
   bankDetails?: Array<BankDetail>;
   isDeleted: boolean;
}

export interface BankDetail {
  name: string;
  branch: string;
  accountNo: string;
  accountHolderName: string;
  isDefault: boolean;
}

const UserSchema = new Schema<UserModel>(
  {
    //Role
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: false,
      index: 1,
    },
    //Asset
    profileImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      index: 1,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    nic: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^(\d{9}[V|v])|(\d{4}\s?\d{4}\s?\d{4})$/,
        "Please enter a valid Sri Lankan NIC number.",
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match:
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: { type: String, required: true },
    address1: { type: String },
    address2: { type: String },
    phoneNumber: [
      {
        type: String,
        required: true,
        match: [
          /^947[01245678][0-9]{7}$/,
          "Please enter a valid Sri Lankan phone number.",
        ],
      },
    ],
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: false,
  
    },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    isPremiumCustomer: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    approvalStatus: { type: Boolean, default: false },
    vehicle: [
      {
        number: { type: String, required: true },
        isDefault: { type: Boolean, required: true, default: false },
      },
    ],
    bankDetails: [
      {
        name: { type: String, required: true },
        branch: { type: String, required: true },
        accountNo: { type: String, required: true },
        accountHolderName: { type: String, required: true },
        isDefault: { type: Boolean, required: true, default: false },
      },
    ],
  },
  { timestamps: true }
);

//setup the pre hook, so everytime we create or update the user with password field with new value, it's gonna encrypt the password.
UserSchema.pre(['save'], async function (next) {
  if (this.isModified('password') && this.password != null) {
    //salt rounds = 8
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const UserDTO = model<UserModel>('User', UserSchema);
