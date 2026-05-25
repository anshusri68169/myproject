import mongoose from 'mongoose';

const enterpriseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    contactPersonName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    panNumber: {
      type: String,
      required: true,
      unique: true,
    },
    panImage: {
      url: String,
      key: String,
    },
    companyRegistration: {
      url: String,
      key: String,
    },
    addressProof: {
      url: String,
      key: String,
    },
    status: {
      type: String,
      enum: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING_APPROVAL',
    },
    teamMembers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['ADMIN', 'MANAGER', 'STAFF'],
        },
        permissions: [String],
      },
    ],
    wallet: {
      balance: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: 'INR',
      },
    },
    monthlyOrders: {
      type: Number,
      default: 0,
    },
    averageDeliveryTime: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    successRate: {
      type: Number,
      default: 0,
    },
    cancellationRate: {
      type: Number,
      default: 0,
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

const Enterprise = mongoose.model('Enterprise', enterpriseSchema);
export default Enterprise;
