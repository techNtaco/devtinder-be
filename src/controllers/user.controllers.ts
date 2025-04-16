import {Request, Response} from 'express';
import {User} from '../models/user.model';

export const createUser = async (req: Request, res: Response) => {
    try {
      const user = await User.create(req.body)
      res.status(201).json({ success: true, user })
    } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'User creation failed' })
    }
  }