import express from 'express';
import multer from 'multer';
import Enterprise from '../models/Enterprise.js';
import User from '../models/User.js';
import ReviewRequest from '../models/ReviewRequest.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Register as Enterprise
router.post(
  '/register',
  upload.fields([
    { name: 'panImage', maxCount: 1 },
    { name: 'companyRegistration', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
  ]),
  asyncHandler(async (req, res) => {
    const {
      contactPersonName,
      companyName,
      phoneNumber,
      email,
      panNumber,
    } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!contactPersonName || !companyName || !phoneNumber || !email || !panNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if already registered
    const existingEnterprise = await Enterprise.findOne({ userId });
    if (existingEnterprise) {
      return res.status(409).json({ error: 'Already registered as enterprise' });
    }

    // Create review request
    const reviewRequest = new ReviewRequest({
      applicantId: userId,
      type: 'ENTERPRISE',
      details: {
        contactPersonName,
        companyName,
        phoneNumber,
        email,
        panNumber,
      },
      documents: {
        pan: {
          status: 'PENDING',
          url: req.files?.panImage?.[0]?.originalname || '',
        },
      },
    });

    await reviewRequest.save();

    // Create enterprise
    const enterprise = new Enterprise({
      userId,
      companyName,
      contactPersonName,
      phoneNumber,
      email,
      panNumber,
      status: 'PENDING_APPROVAL',
      wallet: {
        balance: 0,
        currency: 'INR',
      },
    });

    await enterprise.save();

    // Update user role
    await User.findByIdAndUpdate(userId, { role: 'enterprise' });

    res.status(201).json({
      success: true,
      message: 'Your details are under review. We will contact you soon.',
      data: {
        enterpriseId: enterprise._id,
        companyName,
        status: 'PENDING_APPROVAL',
        reviewRequestId: reviewRequest._id,
      },
    });
  })
);

// Get Enterprise Profile
router.get(
  '/:enterpriseId',
  asyncHandler(async (req, res) => {
    const { enterpriseId } = req.params;

    const enterprise = await Enterprise.findById(enterpriseId).populate(
      'userId',
      'name email phone'
    );

    if (!enterprise) {
      return res.status(404).json({ error: 'Enterprise not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        enterpriseId: enterprise._id,
        companyName: enterprise.companyName,
        contactPersonName: enterprise.contactPersonName,
        phoneNumber: enterprise.phoneNumber,
        email: enterprise.email,
        status: enterprise.status,
        wallet: enterprise.wallet,
        monthlyOrders: enterprise.monthlyOrders,
        averageDeliveryTime: enterprise.averageDeliveryTime,
        stats: {
          totalOrders: enterprise.totalOrders,
          successRate: enterprise.successRate,
          cancellationRate: enterprise.cancellationRate,
        },
      },
    });
  })
);

// Update Enterprise Profile
router.put(
  '/:enterpriseId',
  asyncHandler(async (req, res) => {
    const { enterpriseId } = req.params;
    const { phoneNumber, email, contactPersonName } = req.body;

    const enterprise = await Enterprise.findByIdAndUpdate(
      enterpriseId,
      {
        phoneNumber: phoneNumber || undefined,
        email: email || undefined,
        contactPersonName: contactPersonName || undefined,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: enterprise,
    });
  })
);

// Add Team Member
router.post(
  '/:enterpriseId/team-members',
  asyncHandler(async (req, res) => {
    const { enterpriseId } = req.params;
    const { email, role, permissions } = req.body;

    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const enterprise = await Enterprise.findByIdAndUpdate(
      enterpriseId,
      {
        $push: {
          teamMembers: {
            userId: user._id,
            role,
            permissions: permissions || [],
          },
        },
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Team member added successfully',
      data: enterprise.teamMembers,
    });
  })
);

// Get Team Members
router.get(
  '/:enterpriseId/team-members',
  asyncHandler(async (req, res) => {
    const { enterpriseId } = req.params;

    const enterprise = await Enterprise.findById(enterpriseId).populate(
      'teamMembers.userId',
      'name email'
    );

    if (!enterprise) {
      return res.status(404).json({ error: 'Enterprise not found' });
    }

    res.status(200).json({
      success: true,
      data: enterprise.teamMembers,
    });
  })
);

export default router;
