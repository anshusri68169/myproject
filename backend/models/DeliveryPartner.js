import mongoose from 'mongoose';

const deliveryPartnerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    aadharNumber: {
      type: String,
      required: true,
      unique: true,
    },
    aadharImage: {
      url: String,
      key: String,
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
    profilePhoto: {
      url: String,
      key: String,
    },
    status: {
      type: String,
      enum: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING_APPROVAL',
    },
    vehicles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
      },
    ],
    serviceArea: {
      center: {
        latitude: Number,
        longitude: Number,
      },
      radius: {
        type: Number,
        default: 20, // km
      },
      areas: [String], // Area names
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalDeliveries: {
      type: Number,
      default: 0,
    },
    successfulDeliveries: {
      type: Number,
      default: 0,
    },
    cancelledDeliveries: {
      type: Number,
      default: 0,
    },
    onTimeDeliveryPercentage: {
      type: Number,
      default: 0,
    },
    cancellationRate: {
      type: Number,
      default: 0,
    },
    currentStatus: {
      type: String,
      enum: ['ONLINE', 'OFFLINE', 'ON_BREAK'],
      default: 'OFFLINE',
    },
    currentLocation: {
      latitude: Number,
      longitude: Number,
      updatedAt: Date,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    monthlyEarnings: {
      type: Number,
      default: 0,
    },
    lastDelivery: Date,
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

const DeliveryPartner = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
export default DeliveryPartner;
