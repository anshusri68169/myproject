import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    pickupLocation: {
      address: String,
      latitude: Number,
      longitude: Number,
      contactName: String,
      contactPhone: String,
    },
    deliveryLocation: {
      address: String,
      latitude: Number,
      longitude: Number,
      contactName: String,
      contactPhone: String,
    },
    packageDetails: {
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      description: String,
      quantity: Number,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'in_transit',
        'delivered',
        'cancelled',
        'returned',
      ],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    amount: {
      type: Number,
      required: true,
    },
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    rating: Number,
    feedback: String,
    notes: String,
    timeline: [
      {
        status: String,
        timestamp: Date,
        location: {
          latitude: Number,
          longitude: Number,
          address: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', OrderSchema);
export default Order;
