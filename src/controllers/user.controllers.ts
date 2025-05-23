import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Connection from '../models/connection.model';
import { User } from '../models/user.model';

export const getSwipeFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = new Types.ObjectId(req.user!.id);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Step 1: Find all connections involving the current user
    const connections = await Connection.find({
      $or: [
        { userA: currentUserId },
        { userB: currentUserId }
      ]
    });

    // Step 2: Build set of excluded users
    const excludedUserIds = new Set<string>();
    excludedUserIds.add(currentUserId.toString());

    for (const conn of connections) {
      const otherUserId = conn.userA.equals(currentUserId) ? conn.userB : conn.userA;

      // If current user has interacted in any way or status is matched
      if (
        conn.likedBy.includes(currentUserId) ||
        conn.ignoredBy.includes(currentUserId) ||
        conn.status === 'matched'
      ) {
        excludedUserIds.add(otherUserId.toString());
      }
    }

    // Step 3: Get all users not in excluded list
    const feedUsers = await User.find({
      _id: { $nin: Array.from(excludedUserIds) },
      role: { $ne: 'admin' }
    }).select('username email firstName lastName age gender about skills photoUrl')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

    res.status(200).json({ feed: feedUsers });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};
