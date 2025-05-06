import { Router } from 'express';
import { getSwipeFeed } from '../controllers/user.controllers';
import { authenticate } from '../middlewares/authMiddleware';

const userRouter = Router();

userRouter.use(authenticate);
userRouter.get('/feed', getSwipeFeed);

export default userRouter;
