import { z } from 'zod';

const createUpdateDiseaseSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .max(30, {
      message: 'Maximum length of name is 30',
    }),
  description: z
    .string({
      required_error: 'Description is required',
    })
    .max(100, {
      message: 'Maximum length of description is 100',
    }),
});

export { createUpdateDiseaseSchema };
