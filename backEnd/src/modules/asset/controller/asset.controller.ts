import { Request, Response } from 'express';
import { errorResponse } from '../../../utils/common.util';
import {
  AssetListResponse,
  AssetResponse,
  CreateAssetResponse,
} from './response/asset.response';
import AssetService from '../service/asset.service';
import { AssetListRequest } from './request/asset.list.request';
import {
  BaseResponse,
  CreatedUpdatedResponse,
} from '../../base/controller/responses/base.repsonse';
import {
  CreateAssetRequest,
  UpdateAssetRequest,
} from './request/create.asset.request';

export const getAssets = async (req: Request, res: Response) => {
  try {
    const response: AssetListResponse = await AssetService.getAssets(
      req.query as unknown as AssetListRequest
    );
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const getAsset = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response: AssetResponse = await AssetService.getAsset(id);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const saveAsset = async (req: Request, res: Response) => {
  try {
    const response: CreateAssetResponse =
      await AssetService.saveAsset(
        req.body.assets as unknown as Array<CreateAssetRequest>
      );
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const updateAsset = async (req: Request, res: Response) => {
  try {
    const response: CreatedUpdatedResponse =
      await AssetService.updateAsset(
        req.body as unknown as UpdateAssetRequest
      );
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const deleteAsset = async (req: Request, res: Response) => {
  try {
    const assetId = req.params.assetId;
    const response: BaseResponse =
      await AssetService.deleteAsset(assetId);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};
