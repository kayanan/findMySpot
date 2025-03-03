import { Request, Response } from 'express';
import { errorResponse } from '@/utils/common.util';
import {
  DiseaseListResponse,
  DiseaseResponse,
} from './response/disease.response';
import DiseaseService from '@/modules/food/service/disease.service';
import { ListRequest } from '../../base/controller/request/list.request';
import {
  BaseResponse,
  CreatedUpdatedResponse,
} from '../../base/controller/responses/base.repsonse';
import { CreateUpdateDiseaseRequest } from './request/create.disease.request';

export const getDiseases = async (req: Request, res: Response) => {
  try {
    const response: DiseaseListResponse =
      await DiseaseService.getDiseases(
        req.query as unknown as ListRequest
      );
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const getDisease = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response: DiseaseResponse =
      await DiseaseService.getDisease(id);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const saveDisease = async (req: Request, res: Response) => {
  try {
    const response: CreatedUpdatedResponse =
      await DiseaseService.saveDisease(
        req.body as unknown as CreateUpdateDiseaseRequest
      );
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const updateDisease = async (req: Request, res: Response) => {
  try {
    const response: CreatedUpdatedResponse =
      await DiseaseService.updateDisease(
        req.params.id,
        req.body as unknown as CreateUpdateDiseaseRequest
      );
    res.status(200).json(response);
  } catch (error: any) {
    res.status(404).json(errorResponse(error.message));
  }
};

export const softDelete = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response: BaseResponse =
      await DiseaseService.softDelete(id);
    console.log(id);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};
