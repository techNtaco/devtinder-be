import {Router} from 'express';
import {createUser, loginUser, logOutUser } from '../controllers/auth.controllers';
import { validate } from '../middlewares/validate';
import { createUserSchema } from '../validators/user.validator';

const authRouter = Router();

authRouter.post('/signup', validate(createUserSchema), createUser)
authRouter.post('/login', loginUser)
authRouter.post('/logout', logOutUser)

export default authRouter;