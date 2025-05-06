import { Router } from 'express';
import { getUserByEmail, deleteUserById, updateUserById } from '../controllers/admin.controllers';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const adminRouter = Router();

adminRouter.use(authenticate);

adminRouter.get('/users/email/:email', authorize('admin'), getUserByEmail);
adminRouter.delete('/users/:id', authorize('admin'), deleteUserById);
adminRouter.patch('/users/:id', authorize('admin'), updateUserById);


export default adminRouter;