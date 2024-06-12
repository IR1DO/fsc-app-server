import { Router } from 'express';
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from 'src/controllers/post';
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
postRouter.get('/detail/:id', getPostById);
postRouter.get('/get-posts', getPosts);
postRouter.delete(
  '/delete/:id',
  verifyToken,
  verifyRole(['ADMIN', 'TEACHER']),
  deletePost
);
postRouter.patch(
  '/update/:id',
  verifyToken,
  verifyRole(['ADMIN', 'TEACHER']),
  updatePost
);

export default postRouter;
