import {
  IngredientDTO,
  IngredientModel,
} from '../data/dtos/ingredient.dto';
import { CreateUpdateIngredientRequest } from '../controller/request/ingredients.request';
import { ListRequest } from '../../base/controller/request/list.request';
import BaseRepository from '@/modules/base/data/repository/base.repository';
import {
  BaseResponse,
  CreatedUpdatedResponse,
} from '../../base/controller/responses/base.repsonse';
import {
  IngredientResponse,
  IngredientListResponse,
} from '../controller/response/ingredient.response';

const addIngredient = async (
  payload: CreateUpdateIngredientRequest
): Promise<CreatedUpdatedResponse> => {
  const ingredientId: string | null = await BaseRepository.create(
    IngredientDTO,
    payload
  );
  if (ingredientId == null) throw new Error('Create fail');
  return { status: true, id: ingredientId };
};

const updateIngredient = async (
  id: string,
  payload: CreateUpdateIngredientRequest
): Promise<CreatedUpdatedResponse> => {
  const ingredient: IngredientModel | null =
    await BaseRepository.updateById(IngredientDTO, id, payload);
  if (ingredient == null) {
    throw new Error('Ingredient not found');
  }
  return { status: true, id: ingredient.id };
};

const getIngredients = async (
  listReq: ListRequest
): Promise<IngredientListResponse> => {
  const query = { isDeleted: false } as any;
  if (listReq.search) {
    query.$or = {
      name: {
        $regex: '.*' + listReq.search ? listReq.search : '.*',
        $options: 'i',
      },
    };
  }
  const ingredient = await BaseRepository.findAll(
    IngredientDTO,
    query,
    listReq.skip,
    listReq.limit
  );
  return {
    status: true,
    totalCount: ingredient.totalCount,
    items: ingredient.items,
  } as IngredientListResponse;
};

const getIngredient = async (
  id: string
): Promise<IngredientResponse> => {
  const result = await BaseRepository.findById(IngredientDTO, id);
  if (result == null) {
    throw new Error('Ingredient not found');
  }
  return { status: true, result } as IngredientResponse;
};

const softDelete = async (id: string): Promise<BaseResponse> => {
  const result = await BaseRepository.softDeleteById(
    IngredientDTO,
    id
  );
  if (!result) {
    throw new Error('Ingredient not found');
  }

  return { status: true };
};

export default {
  addIngredient,
  updateIngredient,
  getIngredients,
  getIngredient,
  softDelete,
};
