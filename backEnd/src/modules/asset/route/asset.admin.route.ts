import { Router } from 'express';
import { getAsset, getAssets } from '../controller/asset.controller';
import { checkAdmin, checkToken } from '@/src/middlewares/check-auth';

const router: Router = Router();

router.get('/list', getAssets);
router.get('/:id', getAsset);

export default router;
