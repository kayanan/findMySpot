import { Request, Response } from 'express';
import { errorResponse } from '@/utils/common.util';
import {
  IngredientListResponse,
  IngredientResponse,
} from './response/ingredient.response';
import IngredientService from '../service/ingredient.service';
import { CreateUpdateIngredientRequest } from './request/ingredients.request';
import {
  CreatedUpdatedResponse,
  BaseResponse,
} from '../../base/controller/responses/base.repsonse';
import { ListRequest } from '../../base/controller/request/list.request';

export const addIngredient = async (req: Request, res: Response) => {
  try {
    const response: CreatedUpdatedResponse =
      await IngredientService.addIngredient(
        req.body as unknown as CreateUpdateIngredientRequest
      );
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const getIngredients = async (req: Request, res: Response) => {
  try {
    const response: IngredientListResponse =
      await IngredientService.getIngredients(
        req.query as unknown as ListRequest
      );
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const getIngredient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response: IngredientResponse =
      await IngredientService.getIngredient(id);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const updateIngredient = async (
  req: Request,
  res: Response
) => {
  try {
    const response: CreatedUpdatedResponse =
      await IngredientService.updateIngredient(
        req.params.id,
        req.body as unknown as CreateUpdateIngredientRequest
      );
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};

export const softDelete = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response: BaseResponse =
      await IngredientService.softDelete(id);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json(errorResponse(error.message));
  }
};
