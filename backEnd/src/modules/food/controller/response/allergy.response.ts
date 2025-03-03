import {
  BaseResponse,
  CountResponse,
} from '../../../base/controller/responses/base.repsonse';
import { AllergyModel } from '../../data/dtos/allergy.dto';

export interface AllergyListResponse extends CountResponse {
  allergies: Array<AllergyModel>;
}

export interface AllergyResponse extends BaseResponse {
  allergy: AllergyModel;
}
