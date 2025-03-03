import { Router } from 'express';
import {
  getDisease,
  saveDisease,
  updateDisease,
  softDelete,
} from '@/modules/food/controller/disease.controller';
import zodValidator from '@/src/middlewares/validator';
import { createUpdateDiseaseSchema } from '@/modules/food/validators/disease.validator';

const router: Router = Router();

router.get('/:id', getDisease);
router.post(
  '/',
  zodValidator(createUpdateDiseaseSchema),
  saveDisease
);
router.put(
  '/:id',
  zodValidator(createUpdateDiseaseSchema),
  updateDisease
);
router.delete('/:id', softDelete);

export default router;
