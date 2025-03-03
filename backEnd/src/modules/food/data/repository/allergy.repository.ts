import { AllergyDTO, AllergyModel } from '../dtos/allergy.dto';
//Function for get by name
function findByName(name: string): Promise<AllergyModel | null> {
  return AllergyDTO.findOne({
    name,
    isDeleted: false,
  });
}

export default {
  findByName,
};
