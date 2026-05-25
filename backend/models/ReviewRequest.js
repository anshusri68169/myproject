import mongoose from 'mongoose';

const reviewRequestSchema = new mongoose.Schema(
  {
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['DELIVERY_PARTNER', 'ENTERPRISE'],
      required: true,
    },
    details: {
      // Flexible schema for different types
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    documents: {
      aadhar: {
        status: {
          type: String,
          enum: ['PENDING', 'VERIFIED', 'REJECTED'],
          default: 'PENDING',
        },
        url: String,
        key: String,
        rejectionReason: String,
      },
      pan: {
        status: {
          type: String,
          enum: ['PENDING', 'VERIFIED', 'REJECTED'],
          default: 'PENDING',
        },
        url: String,
        key: String,
        rejectionReason: String,
      },
      other: [
        {
          name: String,
          status: {
            type: String,
            enum: ['PENDING', 'VERIFIED', 'REJECTED'],
          },
          url: String,
          key: String,
        },
      ],
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'ON_HOLD'],
      default: 'PENDING',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: Date,
    rejectionReason: String,
    resubmitAllowed: {
      type: Boolean,
      default: false,
    },
    internalNotes: String,
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

const ReviewRequest = mongoose.model('ReviewRequest', reviewRequestSchema);
export default ReviewRequest;
