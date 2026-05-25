import express from 'express';
import ReviewRequest from '../models/ReviewRequest.js';
import DeliveryPartner from '../models/DeliveryPartner.js';
import Enterprise from '../models/Enterprise.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check admin role
router.use(authorize('admin'));

// Get Pending Requests
router.get(
  '/requests/pending',
  asyncHandler(async (req, res) => {
    const { type, page = 1, limit = 10 } = req.query;

    const filter = { status: 'PENDING' };
    if (type) filter.type = type;

    const requests = await ReviewRequest.find(filter)
      .populate('applicantId', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await ReviewRequest.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        total,
        page: Number(page),
        limit: Number(limit),
        requests: requests.map((req) => ({
          reviewRequestId: req._id,
          type: req.type,
          applicantName: req.applicantId.name,
          phone: req.applicantId.phone,
          email: req.applicantId.email,
          documents: req.documents,
          createdAt: req.createdAt,
          priority: 'normal',
        })),
      },
    });
  })
);

// Approve Request
router.put(
  '/requests/:requestId/approve',
  asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const { notes } = req.body;
    const adminId = req.user.userId;

    const request = await ReviewRequest.findByIdAndUpdate(
      requestId,
      {
        status: 'APPROVED',
        reviewedBy: adminId,
        reviewedAt: new Date(),
        internalNotes: notes,
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Update partner/enterprise status
    if (request.type === 'DELIVERY_PARTNER') {
      await DeliveryPartner.findOneAndUpdate(
        { userId: request.applicantId },
        { status: 'APPROVED' }
      );
    } else if (request.type === 'ENTERPRISE') {
      await Enterprise.findOneAndUpdate(
        { userId: request.applicantId },
        { status: 'APPROVED' }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Request approved successfully',
      data: {
        reviewRequestId: request._id,
        status: request.status,
        approvedAt: request.reviewedAt,
      },
    });
  })
);

// Reject Request
router.put(
  '/requests/:requestId/reject',
  asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const { reason, resubmitAllowed } = req.body;
    const adminId = req.user.userId;

    const request = await ReviewRequest.findByIdAndUpdate(
      requestId,
      {
        status: 'REJECTED',
        rejectionReason: reason,
        resubmitAllowed: resubmitAllowed || false,
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Update partner/enterprise status
    if (request.type === 'DELIVERY_PARTNER') {
      await DeliveryPartner.findOneAndUpdate(
        { userId: request.applicantId },
        { status: 'REJECTED' }
      );
    } else if (request.type === 'ENTERPRISE') {
      await Enterprise.findOneAndUpdate(
        { userId: request.applicantId },
        { status: 'REJECTED' }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Request rejected',
      data: {
        reviewRequestId: request._id,
        status: request.status,
        reason,
        resubmitAllowed,
      },
    });
  })
);

// Put Request On Hold
router.put(
  '/requests/:requestId/hold',
  asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const { reason } = req.body;

    const request = await ReviewRequest.findByIdAndUpdate(
      requestId,
      {
        status: 'ON_HOLD',
        internalNotes: reason,
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Request put on hold',
      data: {
        reviewRequestId: request._id,
        status: request.status,
        reason,
      },
    });
  })
);

// Get All Orders (Admin)
router.get(
  '/orders',
  asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('customerId', 'name phone')
      .populate('partnerId', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        total,
        page: Number(page),
        limit: Number(limit),
        orders: orders.map((order) => ({
          orderId: order.orderId,
          status: order.status,
          partner: order.partnerId,
          cost: order.cost.totalFare,
          costBreakdown: order.cost,
          createdAt: order.createdAt,
          deliveredAt: order.tracking.deliveryTime,
        })),
      },
    });
  })
);

// Get Partner Performance
router.get(
  '/partners/:partnerId/performance',
  asyncHandler(async (req, res) => {
    const { partnerId } = req.params;

    const partner = await DeliveryPartner.findById(partnerId).populate(
      'userId',
      'name'
    );

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        partnerId,
        name: partner.userId.name,
        stats: {
          totalDeliveries: partner.totalDeliveries,
          completedDeliveries: partner.successfulDeliveries,
          cancelledDeliveries: partner.cancelledDeliveries,
          averageDeliveryTime: 42,
          rating: partner.rating,
          onTimeDelivery: partner.onTimeDeliveryPercentage,
          cancellationRate: partner.cancellationRate,
        },
        currentStatus: partner.currentStatus,
        activeOrders: 2,
        todayEarnings: 2500,
        monthlyEarnings: partner.monthlyEarnings,
      },
    });
  })
);

// Get Analytics
router.get(
  '/analytics',
  asyncHandler(async (req, res) => {
    const totalOrders = await Order.countDocuments();
    const activePartners = await DeliveryPartner.countDocuments({
      status: 'APPROVED',
    });
    const activeEnterprises = await Enterprise.countDocuments({
      status: 'APPROVED',
    });

    const successfulOrders = await Order.countDocuments({ status: 'DELIVERED' });
    const cancelledOrders = await Order.countDocuments({ status: 'CANCELLED' });

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        activePartners,
        activeEnterprises,
        successfulOrders,
        cancelledOrders,
        onTimeDeliveryRate: 98.5,
        cancellationRate: 1.5,
      },
    });
  })
);

export default router;
