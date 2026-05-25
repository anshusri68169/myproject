import express from 'express';
import multer from 'multer';
import Order from '../models/Order.js';
import Wallet from '../models/Wallet.js';
import DeliveryPartner from '../models/DeliveryPartner.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { io } from '../server.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Generate Order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `ORD_${timestamp}${random}`;
};

// Create Order
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const {
      pickupLocation,
      deliveryLocation,
      parcel,
      vehicleType,
      paymentMethod,
      scheduledTime,
    } = req.body;
    const customerId = req.user.userId;

    // Validation
    if (!pickupLocation || !deliveryLocation || !parcel || !vehicleType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate cost
    const baseFare = { bike: 50, scooter: 75, auto: 100 }[vehicleType];
    const distanceFare = 20; // ₹20 per km
    const weightSurcharge = parcel.weight * 5; // ₹5 per kg
    const tax = 0;
    const totalFare = baseFare + distanceFare + weightSurcharge + tax;

    // Create order
    const orderId = generateOrderId();
    const order = new Order({
      orderId,
      customerId,
      pickupLocation,
      deliveryLocation,
      parcel,
      vehicleType,
      paymentMethod,
      cost: {
        baseFare,
        distanceFare,
        weightSurcharge,
        tax,
        totalFare,
      },
      tracking: {
        startTime: new Date(),
        estimatedDeliveryTime: new Date(Date.now() + 45 * 60000),
      },
    });

    await order.save();

    // Deduct from wallet if prepaid
    if (paymentMethod === 'wallet') {
      await Wallet.findOneAndUpdate(
        { userId: customerId },
        { $inc: { balance: -totalFare } },
        { new: true }
      );

      order.paymentStatus = 'PAID';
      await order.save();
    }

    // Emit event to find delivery partner
    io.emit('order_created', {
      orderId: order._id,
      pickupLocation,
      deliveryLocation,
      vehicleType,
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order.orderId,
        status: order.status,
        estimatedCost: totalFare,
        costBreakdown: order.cost,
        estimatedDeliveryTime: 45,
        estimatedDeliveryDate: order.tracking.estimatedDeliveryTime,
      },
    });
  })
);

// Get Order Details
router.get(
  '/:orderId',
  asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('customerId', 'name phone')
      .populate('partnerId', 'name rating vehicle');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        orderId: order.orderId,
        status: order.status,
        pickupLocation: order.pickupLocation,
        deliveryLocation: order.deliveryLocation,
        assignedPartner: order.partnerId,
        cost: order.cost,
        paymentStatus: order.paymentStatus,
        tracking: order.tracking,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  })
);

// Track Order (Real-time)
router.get(
  '/:orderId/track',
  asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate(
      'partnerId',
      'currentLocation'
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        orderId: order.orderId,
        currentLocation: order.partnerId?.currentLocation,
        distance: 2.3,
        estimatedDeliveryTime: 15,
        status: order.status,
      },
    });
  })
);

// Update Order Status
router.put(
  '/:orderId/status',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
  ]),
  asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status, reason, otp } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update tracking timestamps
    if (status === 'PICKED_UP') {
      order.tracking.pickupTime = new Date();
    } else if (status === 'DELIVERED') {
      order.tracking.deliveryTime = new Date();
      // Add earnings to partner wallet
      const partner = await DeliveryPartner.findById(order.partnerId);
      await Wallet.findOneAndUpdate(
        { userId: partner.userId },
        { $inc: { balance: order.cost.totalFare } },
        { new: true }
      );
    }

    await order.save();

    // Emit update event
    io.emit('order_updated', {
      orderId: order._id,
      status: order.status,
    });

    res.status(200).json({
      success: true,
      data: {
        orderId: order.orderId,
        status: order.status,
        updatedAt: order.updatedAt,
      },
    });
  })
);

// Accept Order (Partner)
router.post(
  '/:orderId/accept',
  asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const partnerId = req.user.userId;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { partnerId, status: 'ASSIGNED' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Emit event
    io.emit('order_assigned', {
      orderId: order._id,
      partnerId,
      status: 'ASSIGNED',
    });

    res.status(200).json({
      success: true,
      message: 'Order accepted successfully',
      data: {
        orderId: order.orderId,
        status: order.status,
      },
    });
  })
);

// Cancel Order
router.post(
  '/:orderId/cancel',
  asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'CANCELLED', cancelReason: reason },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Refund to wallet
    if (order.paymentMethod === 'wallet' && order.paymentStatus === 'PAID') {
      await Wallet.findOneAndUpdate(
        { userId: order.customerId },
        { $inc: { balance: order.cost.totalFare } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        orderId: order.orderId,
        status: order.status,
      },
    });
  })
);

// Rate Order
router.post(
  '/:orderId/rate',
  asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { score, comment } = req.body;

    if (!score) {
      return res.status(400).json({ error: 'Rating score required' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        rating: {
          score,
          comment,
          timestamp: new Date(),
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
      data: order.rating,
    });
  })
);

export default router;
