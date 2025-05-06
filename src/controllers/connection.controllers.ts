import { Request, Response } from 'express';
import Connection from '../models/connection.model';
import { User } from '../models/user.model'
import mongoose, { Types } from 'mongoose'


export const handleSwipeAction = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = new Types.ObjectId(req.user!.id);
    const otherUserId = new Types.ObjectId(req.params.otherUserId);
    const action = req.params.action;

    if (!['like', 'ignore'].includes(action) || currentUserId.equals(otherUserId)) {
      res.status(400).json({ message: 'Invalid action or user IDs.' });
      return;
    }

    // ✅ Check if other user actually exists
    const userExists = await User.exists({ _id: otherUserId });
    if (!userExists) {
      res.status(404).json({ message: 'Target user does not exist.' });
      return;
    }

    const userA = currentUserId < otherUserId ? currentUserId : otherUserId;
    const userB = currentUserId < otherUserId ? otherUserId : currentUserId;

    const connection = await Connection.findOne({ userA, userB });

    // ✅ Handle ignore (disallowed if already matched)
    if (action === 'ignore') {
      if (connection?.status === 'matched') {
        res.status(400).json({ message: 'Cannot ignore a matched user. Use unmatch instead.' });
        return;
      }

      if (!connection) {
        await new Connection({
          userA,
          userB,
          likedBy: [],
          ignoredBy: [currentUserId],
          status: 'ignored'
        }).save();
      } else {
        if (!connection.ignoredBy.includes(currentUserId)) {
          connection.ignoredBy.push(currentUserId);
        }
        connection.likedBy = connection.likedBy.filter(
          id => !id.equals(currentUserId)
        );
        connection.status = 'ignored';
        await connection.save();
      }

      res.status(201).json({ message: 'User ignored.' });
      return;
    }

    // ✅ Handle like
    if (!connection) {
      await new Connection({
        userA,
        userB,
        likedBy: [currentUserId],
        ignoredBy: [],
        status: 'pending'
      }).save();
      res.status(201).json({ message: 'Like recorded.' });
      return;
    }

    // ✅ If other person already ignored you, like is wasted but stored
    if (connection.ignoredBy.includes(otherUserId)) {
      if (!connection.likedBy.includes(currentUserId)) {
        connection.likedBy.push(currentUserId);
      }
      connection.status = 'ignored';
      await connection.save();
      res.status(201).json({ message: 'Like recorded, but match is blocked (ignored).' });
      return;
    }

    // ✅ Prevent liking someone you’ve already ignored
    if (connection.ignoredBy.includes(currentUserId)) {
      res.status(403).json({ message: 'You have ignored this user.' });
      return;
    }

    // ✅ Register like
    if (!connection.likedBy.includes(currentUserId)) {
      connection.likedBy.push(currentUserId);
    }

    // ✅ Check for mutual match
    if (connection.likedBy.includes(currentUserId) && connection.likedBy.includes(otherUserId)) {
      connection.status = 'matched';
      await connection.save();
      res.status(201).json({ message: 'It’s a Match!' });
      return;
    }

    // ✅ Like recorded but not mutual yet
    connection.status = 'pending';
    await connection.save();
    res.status(201).json({ message: 'Like recorded.' });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

export const getMatches = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.user!.id);

    const matchedConnections = await Connection.find({
      status: 'matched',
      $or: [
        { userA: currentUserId },
        { userB: currentUserId }
      ]
    }).populate([
      { path: 'userA', select: 'username email firstName lastName' },
      { path: 'userB', select: 'username email firstName lastName' }
    ]);

    const matchedUsers = matchedConnections.map(connection => {
      const matchedUser = connection.userA._id.equals(currentUserId)
        ? connection.userB
        : connection.userA;

      return {
        user: matchedUser,
        matchedAt: connection.matchedAt
      };
    });

    res.status(200).json({ matches: matchedUsers });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};