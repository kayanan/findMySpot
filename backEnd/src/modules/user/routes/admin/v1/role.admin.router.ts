import { Router } from 'express';
import {
  getRole,
  createRole,
  updateRole,
  softDelete,
  getRoles,
} from '../../../controller/role.controller';
import { checkAdmin, checkToken } from '@/src/middlewares/check-auth';

const roleAdminRouter: Router = Router();

roleAdminRouter.get('/', getRoles);
roleAdminRouter.get('/:id', checkToken, checkAdmin, getRole);
roleAdminRouter.post('/', checkToken, checkAdmin, createRole);
roleAdminRouter.put('/:id', checkToken, checkAdmin, updateRole);
roleAdminRouter.delete('/:id', checkToken, checkAdmin, softDelete);

export default roleAdminRouter;
