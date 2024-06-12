import { RequestHandler } from 'express';
import { sendErrorRes } from 'src/utils/helper';
import { z } from 'zod';

export const validate = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
): RequestHandler => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        sendErrorRes(res, error.errors[0].message, 422);
      } else {
        next(error);
      }
    }
  };
};
