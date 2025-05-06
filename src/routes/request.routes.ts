import express from 'express';
import { handleSwipeAction, getMatches } from '../controllers/connection.controllers';
import { authenticate } from '../middlewares/authMiddleware';

const requestRoutes = express.Router();

requestRoutes.use(authenticate);

requestRoutes.post('/:action/:otherUserId', handleSwipeAction);
requestRoutes.get('/matches', getMatches);


export default requestRoutes;
