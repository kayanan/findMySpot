import Zod from 'zod';

const createUpdateIngredientSchema = Zod.object({
  name: Zod.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  })
    .max(100, { message: 'Must be 100 or fewer characters long' })
    .transform((data) => {
      return data
        .charAt(0)
        .toUpperCase()
        .concat(data.slice(1).toLowerCase().trim());
    }),

  isAvailable: Zod.boolean({
    required_error: 'isAvailable is required',
    invalid_type_error: 'isAvailable must be a boolean',
  }).optional(),

  isDeleted: Zod.boolean({
    invalid_type_error: 'isDeleted must be a boolean',
  }).optional(),

  description: Zod.string({
    invalid_type_error: 'Name must be a string',
  })
    .max(200, { message: 'Must be 200 or fewer characters long' })
    .optional()
    .transform((data) => {
      return data
        ?.charAt(0)
        .toUpperCase()
        .concat(data.slice(1).toLowerCase().trim());
    }),
});

type CreateUpdateIngredientRequest = Zod.infer<
  typeof createUpdateIngredientSchema
>;

export {
  type CreateUpdateIngredientRequest,
  createUpdateIngredientSchema,
};
