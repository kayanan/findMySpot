import { AllergyDTO } from '../data/dtos/allergy.dto';
import BaseRepository from '@/modules/base/data/repository/base.repository';
import AllergyRepository from '@/modules/food/data/repository/allergy.repository';
import { AllergyModel } from '../data/dtos/allergy.dto';
import { ListRequest } from '../../base/controller/request/list.request';
import {
  AllergyListResponse,
  AllergyResponse,
} from '../controller/response/allergy.response';
import { isValidObjectId } from 'mongoose';
import { AllergyRequest } from '../controller/request/create.allergy';
import {
  BaseResponse,
  CreatedUpdatedResponse,
} from '../../base/controller/responses/base.repsonse';
import { createUpdateAllergyValidator } from '../validators/allergy.validator';

// Service For getAll Allergies
export const getAllergies = async (
  listReq: ListRequest
): Promise<AllergyListResponse> => {
  const query = { isDeleted: false } as any;
  if (listReq.search) {
    query.$or = {
      name: {
        $regex: '.*' + listReq.search ? listReq.search : '.*',
        $options: 'i',
      },
    };
  }
  const allergies = await BaseRepository.findAll(
    AllergyDTO,
    query,
    listReq.skip,
    listReq.limit
  );
  return {
    status: true,
    totalCount: allergies.totalCount,
    allergies: allergies.items,
  };
};

//Service for getOne allergy
export const getAllergy = async (
  id: string
): Promise<AllergyResponse> => {
  if (!isValidObjectId(id)) throw new Error('Invalid Role Id');
  const allergy: AllergyModel | null = await BaseRepository.findById(
    AllergyDTO,
    id
  );
  if (!allergy) throw new Error(`Allergy not found with ${id}`);
  return { status: true, allergy } as AllergyResponse;
};
//Service for create allergy
export const createAllergy = async (
  allergyData: AllergyRequest
): Promise<CreatedUpdatedResponse> => {
  const validatedResult = createUpdateAllergyValidator(allergyData);
  const allergyId: string | null = await BaseRepository.create(
    AllergyDTO,
    allergyData
  );
  if (allergyId == null) throw new Error('Create fail');
  return { status: true, id: allergyId } as CreatedUpdatedResponse;
};

//Service for update allergy
export const updateAllergy = async (
  id: string,
  allergyData: AllergyRequest
): Promise<CreatedUpdatedResponse> => {
  const validatedResult = createUpdateAllergyValidator(allergyData);
  const allergy: AllergyModel | null =
    await BaseRepository.updateById(AllergyDTO, id, allergyData);
  if (allergy == null) throw new Error('update fail');
  return { status: true, id: allergy.id };
};
//Serive for delete allergy

export const softDelete = async (
  id: string
): Promise<BaseResponse> => {
  if (!isValidObjectId(id)) throw new Error('Invalid Role id');
  await BaseRepository.softDeleteById(AllergyDTO, id);
  return { status: true };
};
