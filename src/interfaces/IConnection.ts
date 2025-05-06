import { Document, Types } from 'mongoose';

export interface IConnection extends Document {
  userA: Types.ObjectId;
  userB: Types.ObjectId;
  likedBy: Types.ObjectId[];
  ignoredBy: Types.ObjectId[];
  status: 'pending' | 'matched' | 'ignored';
  matchedAt?: Date | null;
  statusUpdatedAt?: Date;
  initiatedAt?: Date;
  updatedAt?: Date;
}
