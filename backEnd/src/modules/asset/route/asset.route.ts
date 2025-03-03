import { Router } from 'express';
import {
  saveAsset,
  updateAsset,
  deleteAsset,
} from '../controller/asset.controller';

const router: Router = Router();

router.post('/create', saveAsset);
router.post('/update', updateAsset);
router.delete('/:assetId', deleteAsset);

export default router;
