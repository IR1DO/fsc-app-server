import { Router } from 'express';
import { createNewUser, signIn, signOut } from 'src/controllers/auth';
import validate from 'src/middleware/validator';
import { userSchema } from 'src/validation/schema/user';

const authRouter = Router();

authRouter.post('/sign-up', validate(userSchema), createNewUser);
authRouter.post('/sign-in', signIn);
authRouter.post('/sign-out', signOut);

export default authRouter;
