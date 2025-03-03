import { BaseResponse } from '../../../base/controller/responses/base.repsonse';
import { IngredientModel } from '../../data/dtos/ingredient.dto';

export interface IngredientListResponse extends BaseResponse {
  totalCount?: number;
  items: Array<IngredientModel>;
}

export interface IngredientResponse extends BaseResponse {
  item?: IngredientModel;
}
