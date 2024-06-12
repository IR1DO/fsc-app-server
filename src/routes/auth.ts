import { Router } from 'express';
import { createNewUser, signIn, signOut } from 'src/controllers/auth';
import { validate } from 'src/middleware/validator';
import { userSignInSchema, userSignUpSchema } from 'src/validation/schema/user';

const authRouter = Router();

authRouter.post('/sign-up', validate(userSignInSchema), createNewUser);
authRouter.post('/sign-in', validate(userSignUpSchema), signIn);
authRouter.post('/sign-out', signOut);

export default authRouter;
