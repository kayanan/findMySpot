import HelperUtil from '../../../../utils/helper.util';
import { AssetDTO, AssetModel } from '../dtos/asset.dto';
import { AssetListRequest } from '../../controller/request/asset.list.request';
import { AssetListResponse } from '../../controller/response/asset.response';
import {
  CreateAssetRequest,
  UpdateAssetRequest,
} from '../../controller/request/create.asset.request';

async function findAssets(
  listReq: AssetListRequest
): Promise<AssetListResponse> {
  const query = { isDeleted: false } as any;
  if (listReq.search) {
    query.$or = [
      {
        name: {
          $regex: '.*' + listReq.search ? listReq.search : '.*',
          $options: 'i',
        },
        ext: {
          $regex: '.*' + listReq.search ? listReq.search : '.*',
          $options: 'i',
        },
      },
    ];
  }
  if (listReq.ext) {
    query.ext = listReq.ext;
  }
  if (listReq.isUploaded) {
    query.isUploaded = listReq.isUploaded;
  }
  const totalCount = await findTotalAssets(query);
  const assets = await AssetDTO.find(query)
    .sort({
      createdAt: 'desc',
    })
    .skip(
      HelperUtil.pageSkip(
        listReq.skip ?? 0,
        listReq.limit ?? Number(process.env.PAGINATION_LIMIT)
      )
    )
    .limit(listReq.limit ?? Number(process.env.PAGINATION_LIMIT))
    .select('-__v');
  return { totalCount, assets };
}

async function findById(id: string): Promise<AssetModel | null> {
  const asset: AssetModel | null =
    await AssetDTO.findById(id).select('-__v');
  return asset;
}

async function findTotalAssets(query: any): Promise<number> {
  return AssetDTO.countDocuments(query);
}

async function saveAsset(
  assetPayload: CreateAssetRequest
): Promise<string> {
  const newAsset = new AssetDTO(assetPayload);
  const { _id } = await newAsset.save();
  return _id as string;
}

async function updateAsset(
  assetPayload: UpdateAssetRequest,
  assetId: string
): Promise<string | null> {
  const updateAsset = (await AssetDTO.findOneAndUpdate(
    { _id: assetId },
    assetPayload,
    {
      new: true,
    }
  )) as unknown as UpdateAssetRequest;

  return updateAsset.id;
}

async function findByName(name: string): Promise<AssetModel | null> {
  const checkAsset = await AssetDTO.findOne({
    name,
    isDeleted: false,
  });
  return checkAsset;
}

async function deleteById(assetId: string): Promise<boolean> {
  const deletedAsset = await AssetDTO.deleteOne({ _id: assetId });
  return deletedAsset.deletedCount > 0 ? true : false;
}

export default {
  findAssets,
  findById,
  findTotalAssets,
  saveAsset,
  updateAsset,
  findByName,
  deleteById,
};
