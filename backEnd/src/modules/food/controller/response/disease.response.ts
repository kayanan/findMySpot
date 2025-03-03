import {
  BaseResponse,
  CountResponse,
} from '../../../base/controller/responses/base.repsonse';
import { DiseaseModel } from '@/modules/food/data/dtos/disease.dto';

export interface DiseaseListResponse extends CountResponse {
  total?: number;
  diseases: Array<DiseaseModel>;
}

export interface DiseaseResponse extends BaseResponse {
  disease: DiseaseModel;
}
