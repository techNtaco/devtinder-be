import { Request, Response } from "express";
import { User } from '../models/user.model'

export const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const email = req.params.email
      const user = await User.findOne({ email }).select('-password')
  
      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      }
  
      res.status(200).json({ user })
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' })
    }
  };

export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
export const updateUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const blockedFields = ['_id', 'password', 'email', '__v', 'role', 'createdAt', 'updatedAt'];
      const updatePayload = req.body;

      for (const field of blockedFields) {
        if (field in updatePayload) {
          res.status(400).json({ error: `Cannot update field: ${field}` });
          return;
        }
      }

      const validFields = Object.keys(User.schema.obj);
      for (const key of Object.keys(updatePayload)) {
        if (!validFields.includes(key)) {
          res.status(400).json({ error: `Invalid field: ${key}` });
          return;
        }
      }

      const user = await User.findById(id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      Object.assign(user, updatePayload);

      await user.save();

      const userObj = user.toObject({
        transform: function (_doc, ret) {
          delete ret.password;
          return ret;
        }
      });
      
  
      res.status(200).json({ message: 'User updated successfully', user: userObj });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
