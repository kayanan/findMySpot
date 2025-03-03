import {
  DiseaseDTO,
  DiseaseModel,
} from '@/modules/food/data/dtos/disease.dto';
import {
  DiseaseListResponse,
  DiseaseResponse,
} from '@/modules/food/controller/response/disease.response';
import { ListRequest } from '../../base/controller/request/list.request';
import { CreateUpdateDiseaseRequest } from '@/modules/food/controller/request/create.disease.request';
import {
  BaseResponse,
  CreatedUpdatedResponse,
} from '../../base/controller/responses/base.repsonse';

import BaseRepository from '@/modules/base/data/repository/base.repository';
import zodValidator from '@/src/middlewares/validator';

const getDiseases = async (
  listReq: ListRequest
): Promise<DiseaseListResponse> => {
  const query = { isDeleted: false } as any;
  if (listReq.search) {
    query.$or = {
      name: {
        $regex: '.*' + listReq.search ? listReq.search : '.*',
        $options: 'i',
      },
    };
  }
  const list = await BaseRepository.findAll(
    DiseaseDTO,
    query,
    listReq.skip,
    listReq.limit
  );

  return {
    status: true,
    totalCount: list.totalCount,
    diseases: list.items,
  };
};

const getDisease = async (id: string): Promise<DiseaseResponse> => {
  const disease: DiseaseModel | null = await BaseRepository.findById(
    DiseaseDTO,
    id
  );
  if (!disease) throw new Error(`Disease not found for id ${id}`);
  return { status: true, disease };
};

const saveDisease = async (
  diseaseData: CreateUpdateDiseaseRequest
): Promise<CreatedUpdatedResponse> => {
  const diseaseId: string = await BaseRepository.create(
    DiseaseDTO,
    diseaseData
  );
  return { status: true, id: diseaseId };
};

const updateDisease = async (
  id: string,
  diseaseData: CreateUpdateDiseaseRequest
): Promise<CreatedUpdatedResponse> => {
  const disease: DiseaseModel | null =
    await BaseRepository.updateById(DiseaseDTO, id, diseaseData);
  if (disease == null) throw new Error('Disease not Updated');
  return { status: true, id: disease.id };
};

const softDelete = async (id: string): Promise<BaseResponse> => {
  // TODO: Check Food
  await BaseRepository.softDeleteById(DiseaseDTO, id);
  return { status: true };
};

export default {
  getDiseases,
  getDisease,
  saveDisease,
  updateDisease,
  softDelete,
};
