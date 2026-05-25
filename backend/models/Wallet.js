import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    transactions: [
      {
        transactionId: {
          type: String,
          unique: true,
        },
        type: {
          type: String,
          enum: ['CREDIT', 'DEBIT'],
        },
        amount: Number,
        reason: String,
        referenceId: String, // Order ID or Recharge ID
        status: {
          type: String,
          enum: ['PENDING', 'SUCCESS', 'FAILED'],
          default: 'PENDING',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;
