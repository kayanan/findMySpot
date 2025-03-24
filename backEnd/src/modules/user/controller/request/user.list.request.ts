import { ListRequest } from '../../../base/controller/request/list.request';

export interface UserListRequest extends ListRequest {
  isVerified?: boolean;
  isActive?: boolean;
  approvalStatus?: boolean;
  role?: string;
}
