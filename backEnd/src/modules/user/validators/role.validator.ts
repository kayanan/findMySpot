import { z } from 'zod';

const createUpdateRoleValidator = (data: any) => {
  const schema = z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .max(30, {
        message: 'Maximum number of name is 30',
      }),
    type: z
      .string({
        required_error: 'Type is required',
      })
      .max(20, {
        message: 'Type should have a maximum length of {#limit}',
      }),
    description: z.string({
      required_error: 'Description is required',
    }),
  });
  return schema.safeParse(data);
};

export default {
  createUpdateRoleValidator,
};
