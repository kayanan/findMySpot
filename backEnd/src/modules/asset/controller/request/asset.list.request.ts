import { ListRequest } from '../../../base/controller/request/list.request';

export interface AssetListRequest extends ListRequest {
  isUploaded?: boolean;
  ext?: string;
}
