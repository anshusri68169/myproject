import Order from '../models/Order.js';
import DeliveryPartner from '../models/DeliveryPartner.js';
import Wallet from '../models/Wallet.js';
import { io } from '../server.js';

const generateOrderId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `ORD_${timestamp}${random}`;
};

export const createOrder = async (req, res, next) => {
  try {
    const {
      pickupLocation,
      deliveryLocation,
      parcel,
      vehicleType,
      paymentMethod,
    } = req.body;
    const customerId = req.user.userId;

    // Validation
    if (!pickupLocation || !deliveryLocation || !parcel || !vehicleType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate cost
    const baseFare = { bike: 50, scooter: 75, auto: 100 }[vehicleType];
    const distanceFare = 20;
    const weightSurcharge = parcel.weight * 5;
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
        {
          $inc: { balance: -totalFare },
          $push: {
            transactions: {
              transactionId: `TXN_${Date.now()}`,
              type: 'DEBIT',
              amount: totalFare,
              reason: `Order ${order.orderId}`,
              referenceId: order._id,
              status: 'SUCCESS',
            },
          },
        },
        { new: true }
      );

      order.paymentStatus = 'PAID';
      await order.save();
    }

    // Find and assign partner
    const partners = await DeliveryPartner.find({
      status: 'APPROVED',
      currentStatus: 'ONLINE',
      vehicleType: vehicleType,
    });

    if (partners.length > 0) {
      const partner = partners[0];
      order.partnerId = partner._id;
      order.status = 'ASSIGNED';
      await order.save();

      io.emit('new_order', {
        orderId: order._id,
        pickupLocation,
        deliveryLocation,
        vehicleType,
      });
    }

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
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, deliveryProof } = req.body;

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

    // Update timestamps
    if (status === 'PICKED_UP') {
      order.tracking.pickupTime = new Date();
    } else if (status === 'DELIVERED') {
      order.tracking.deliveryTime = new Date();
      if (deliveryProof) {
        order.deliveryProof = deliveryProof;
      }

      // Add earnings to partner wallet
      const partner = await DeliveryPartner.findById(order.partnerId);
      if (partner) {
        await Wallet.findOneAndUpdate(
          { userId: partner.userId },
          {
            $inc: { balance: order.cost.totalFare },
            $push: {
              transactions: {
                transactionId: `TXN_${Date.now()}`,
                type: 'CREDIT',
                amount: order.cost.totalFare,
                reason: `Delivery ${order.orderId}`,
                referenceId: order._id,
                status: 'SUCCESS',
              },
            },
          },
          { new: true }
        );
      }
    }

    await order.save();

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
  } catch (error) {
    next(error);
  }
};
