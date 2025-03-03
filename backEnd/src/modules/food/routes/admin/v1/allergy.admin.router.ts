import { Router } from 'express';
import {
  getAllergies,
  getAllergy,
  createAllergy,
  updateAllergy,
  softDelete,
} from '../../../controller/allergy.controller';
import { checkAdmin, checkToken } from '@/src/middlewares/check-auth';

const router: Router = Router();

router.get('/:id', getAllergy);
router.post(
  '/',
  // checkToken,
  // checkAdmin,
  createAllergy
);
router.put(
  '/:id',
  // checkToken,
  // checkAdmin,
  updateAllergy
);
router.delete('/:id', softDelete);
router.get('/', getAllergies);

export default router;
