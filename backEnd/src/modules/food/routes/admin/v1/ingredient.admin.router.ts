import { Router } from 'express';
import {
  getIngredients,
  getIngredient,
  addIngredient,
  updateIngredient,
  softDelete,
} from '../../../../food/controller/ingredient.controller';
import { checkAdmin, checkToken } from '@/src/middlewares/check-auth';
import zodValidator from '@/src/middlewares/validator';
import { createUpdateIngredientSchema } from '@/modules/food/controller/request/ingredients.request';

const ingredientAdminRouter: Router = Router();

ingredientAdminRouter.get('/', getIngredients);
ingredientAdminRouter.get('/:id', getIngredient);
ingredientAdminRouter.post(
  '/',
  zodValidator(createUpdateIngredientSchema),
  addIngredient
);
ingredientAdminRouter.put(
  '/:id',
  zodValidator(createUpdateIngredientSchema),
  updateIngredient
);
ingredientAdminRouter.delete('/:id', softDelete);

export default ingredientAdminRouter;
