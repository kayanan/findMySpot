import { Router } from 'express';
import { getDiseases } from '@/modules/food/controller/disease.controller';

const router: Router = Router();

router.get('/', getDiseases);

export default router;
