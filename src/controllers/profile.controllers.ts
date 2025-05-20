import { Request, Response } from 'express';
import { User } from '../models/user.model';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id).select('-password');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const blockedFields = ['_id', 'password', 'email', '__v', 'role',  'createdAt', 'updatedAt'];
    const updates = req.body;

    for (const field of blockedFields) {
      if (field in updates) {
        res.status(400).json({ error: `Cannot update field: ${field}` });
        return;
      }
    }

    const validFields = Object.keys(User.schema.obj);
    for (const key of Object.keys(updates)) {
      if (!validFields.includes(key)) {
        res.status(400).json({ error: `Invalid field: ${key}` });
        return;
      }
    }

    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    Object.assign(user, updates);
    await user.save();

    const userObj = user.toObject({
      transform: (_doc, ret) => {
        delete ret.password;
        return ret;
      }
    });

    res.status(200).json({ message: 'Profile updated', user: userObj });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current and new passwords are required' });
      return;
    }

    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ error: 'Current password is incorrect' });
      return;
    }

    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      res.status(400).json({ error: 'New password must be different from the current password' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
  

export const deleteMyAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.user!.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'Your account has been deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
