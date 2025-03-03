import { Router } from 'express';
import { getIngredients } from '../../../../food/controller/ingredient.controller';

const ingredientRouter: Router = Router();

// Ingredients routes
ingredientRouter.get('/', getIngredients);

export default ingredientRouter;
