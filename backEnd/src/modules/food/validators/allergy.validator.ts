import { z } from 'zod';

export const createUpdateAllergyValidator = (data: any) => {
  const schema = z.object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: "Name should be a type of 'String'",
      })
      .min(1, 'Name should have a minimum length of 1'),
    description: z
      .string({
        required_error: 'Description is required',
        invalid_type_error:
          "Description should be a type of 'String'",
      })
      .min(10, 'Description should have a minimum length of 10'),
  });

  return schema.safeParse(data);
};
