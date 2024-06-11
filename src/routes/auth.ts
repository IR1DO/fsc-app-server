import { Router } from 'express';
import { createNewUser, signIn } from 'src/controllers/auth';
import validate from 'src/middleware/validator';
import { userSchema } from 'src/validation/schema/user';

const authRouter = Router();

authRouter.post('/sign-up', validate(userSchema), createNewUser);
authRouter.post('/sign-in', signIn);

export default authRouter;
