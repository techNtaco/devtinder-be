import { Router } from 'express';
import { getProfile, updateProfile, updatePassword, deleteMyAccount } from '../controllers/profile.controllers';
import { authenticate } from '../middlewares/authMiddleware';

const profileRouter = Router();

profileRouter.use(authenticate);

profileRouter.get('/', getProfile);
profileRouter.post('/edit', updateProfile);
profileRouter.patch('/password', updatePassword);
profileRouter.delete('/delete', deleteMyAccount);

export default profileRouter;