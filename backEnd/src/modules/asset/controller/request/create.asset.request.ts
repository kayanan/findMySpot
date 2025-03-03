import { AssetBaseType, AssetExtType } from '../../types/asset.type';

export interface CreateAssetRequest {
  name: string;
  base: AssetBaseType;
  ext: AssetExtType;
  isUploaded: boolean;
}

export interface UpdateAssetRequest {
  id: string;
  isUploaded: boolean;
}
