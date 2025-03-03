import { AssetModel } from '../data/dtos/asset.dto';
import {
  AssetListResponse,
  AssetResponse,
  CreateAssetResponse,
} from '../controller/response/asset.response';
import * as AssetValidator from '../validators/asset.validator';
import { AssetListRequest } from '../controller/request/asset.list.request';
import AssetRepository from '../data/repository/asset.repository';
import {
  CreateAssetRequest,
  UpdateAssetRequest,
} from '../controller/request/create.asset.request';
import {
  BaseResponse,
  CreatedUpdatedResponse,
} from '../../base/controller/responses/base.repsonse';
import * as AWSRepository from '../../base/data/repository/aws.repository';

const getAssets = async (
  listReq: AssetListRequest
): Promise<AssetListResponse> => {
  const list: AssetListResponse =
    await AssetRepository.findAssets(listReq);
  for (const asset of list.assets) {
    asset.url = await AWSRepository.getFileUrl(
      `${asset?.base}/${asset?.id}.${asset?.ext}`
    );
  }
  return {
    status: true,
    totalCount: list.totalCount,
    assets: list.assets,
  } as AssetListResponse;
};

const getAsset = async (id: string): Promise<AssetResponse> => {
  const asset: AssetModel | null = await AssetRepository.findById(id);
  if (!asset) throw new Error('Not found');
  asset.url = await AWSRepository.getFileUrl(
    `${asset?.base}/${asset?.id}.${asset?.ext}`
  );
  return { status: true, asset } as AssetResponse;
};

const saveAsset = async (
  createAssetRequest: Array<CreateAssetRequest>
): Promise<CreateAssetResponse> => {
  const valResult = AssetValidator.saveAssetValidator(
    createAssetRequest
  );
  if (valResult.error) throw new Error(valResult.error.message);
  const uploadUrl = [];
  for (const asset of createAssetRequest) {
    const id: string = await AssetRepository.saveAsset(asset);
    const url = await AWSRepository.uploadUrlByKey(
      asset.ext,
      asset.base,
      id
    );
    uploadUrl.push({ id, url });
  }
  return { status: true, uploadUrl } as CreateAssetResponse;
};

const updateAsset = async (
  updateAssetRequest: UpdateAssetRequest
): Promise<CreatedUpdatedResponse> => {
  const valResult = AssetValidator.updateAssetValidator(
    updateAssetRequest
  );
  if (valResult.error) throw new Error(valResult.error.message);
  const id: string | null = await AssetRepository.updateAsset(
    updateAssetRequest,
    updateAssetRequest.id
  );
  if (id != null) {
    return { status: true, id } as CreatedUpdatedResponse;
  }
  throw new Error('Asset not Updated');
};

const deleteAsset = async (
  assetId: string
): Promise<BaseResponse> => {
  const status: boolean = await AssetRepository.deleteById(assetId);
  return { status } as BaseResponse;
};

const getAssetUrl = async (id: string): Promise<string | null> => {
  const asset: AssetModel | null = await AssetRepository.findById(id);
  if (!asset) return null;
  console.log(asset);

  const url = await AWSRepository.getFileUrl(
    `user/${asset?._id}.${asset?.ext}`
  );
  return url;
};

export default {
  getAssets,
  getAsset,
  saveAsset,
  updateAsset,
  deleteAsset,
  getAssetUrl,
};
