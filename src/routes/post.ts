import { Router } from 'express';
import { createPost } from 'src/controllers/post';
import { verifyRole, verifyToken } from 'src/middleware/auth';
import { validate } from 'src/middleware/validator';
import { postCreateSchema } from 'src/validation/schema/post';

const postRouter = Router();

postRouter.post(
  '/create',
  verifyToken,
  verifyRole(['ADMIN', 'TEACHER']),
  validate(postCreateSchema),
  createPost
);

export default postRouter;
