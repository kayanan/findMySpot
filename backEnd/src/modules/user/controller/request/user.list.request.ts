import { ListRequest } from '../../../base/controller/request/list.request';

export interface UserListRequest extends ListRequest {
  isVerified?: string;
  isActive?: string;
  approvalStatus?: string;
  role?: string;
}
