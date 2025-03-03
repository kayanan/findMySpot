import { Schema, model } from 'mongoose';
import { BaseDTO } from '../../../base/data/dtos/base.dto';
import { RoleTypeEnum } from '@/modules/user/enums/role';

export interface RoleModel extends BaseDTO {
  name: string;
  type: string;
  description?: string;
}

const RoleSchema = new Schema<RoleModel>(
  {
    name: { type: String, unique: true, required: true },
    type: { type: String, enum: RoleTypeEnum, required: true },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const RoleDTO = model<RoleModel>('Role', RoleSchema);
