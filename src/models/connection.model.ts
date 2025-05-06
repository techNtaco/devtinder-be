import mongoose, { Schema } from 'mongoose';
import { IConnection } from '../interfaces/IConnection';

const connectionSchema = new Schema<IConnection>(
  {
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    ignoredBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'matched', 'ignored'],
      required: true,
      default: 'pending'
    },
    matchedAt: {
      type: Date,
      default: null
    },
    statusUpdatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: { createdAt: 'initiatedAt', updatedAt: 'updatedAt' }
  }
);

connectionSchema.index({ userA: 1, userB: 1 }, { unique: true });

connectionSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.statusUpdatedAt = new Date();
    if (this.status === 'matched' && !this.matchedAt) {
      this.matchedAt = new Date();
    }
  }
  next();
});

export default mongoose.model<IConnection>('Connection', connectionSchema);
