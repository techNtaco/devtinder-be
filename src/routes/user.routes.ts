import {Router} from 'express';
import {createUser} from '../controllers/user.controllers';

const router = Router();

router.post('/', createUser)

export default router;