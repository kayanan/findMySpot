import { Request, Response } from 'express';
import { errorResponse } from '@/utils/common.util';
import {
  AllergyListResponse,
  AllergyResponse,
} from './response/allergy.response';
import * as AllergyService from '../service/allergy.service';
import {
  AllergyRequest,
  UpdateAllergy,
} from './request/create.allergy';
import { ListRequest } from '@/modules/base/controller/request/list.request';
import {
  BaseResponse,
  CreatedUpdatedResponse,
} from '@/modules/base/controller/responses/base.repsonse';

//Controller for Get all Allergies
export const getAllergies = async (req: Request, res: Response) => {
  try {
    const response: AllergyListResponse =
      await AllergyService.getAllergies(
        req.query as unknown as ListRequest
      );
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};
//Controller for Get One Allergy
export const getAllergy = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const response: AllergyResponse =
      await AllergyService.getAllergy(id);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};
//Controller for Create Allergy
export const createAllergy = async (req: Request, res: Response) => {
  try {
    const response: CreatedUpdatedResponse =
      await AllergyService.createAllergy(
        req.body as unknown as AllergyRequest
      );
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};
//Controller for Update Allergy
export const updateAllergy = async (req: Request, res: Response) => {
  try {
    const response = await AllergyService.updateAllergy(
      req.params.id,
      req.body as unknown as UpdateAllergy
    );
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};
//Controller for Delete Allergy
export const softDelete = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response: BaseResponse =
      await AllergyService.softDelete(id);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};
