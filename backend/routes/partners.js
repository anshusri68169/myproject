import express from 'express';
import multer from 'multer';
import DeliveryPartner from '../models/DeliveryPartner.js';
import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';
import ReviewRequest from '../models/ReviewRequest.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Register as Delivery Partner
router.post(
  '/register',
  upload.fields([
    { name: 'aadharImage', maxCount: 1 },
    { name: 'panImage', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 },
  ]),
  asyncHandler(async (req, res) => {
    const { name, mobileNumber, city, aadharNumber, panNumber } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!name || !mobileNumber || !aadharNumber || !panNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if already registered as partner
    const existingPartner = await DeliveryPartner.findOne({ userId });
    if (existingPartner) {
      return res.status(409).json({ error: 'Already registered as partner' });
    }

    // Create review request
    const reviewRequest = new ReviewRequest({
      applicantId: userId,
      type: 'DELIVERY_PARTNER',
      details: {
        name,
        mobileNumber,
        city,
        aadharNumber,
        panNumber,
      },
      documents: {
        aadhar: {
          status: 'PENDING',
          url: req.files?.aadharImage?.[0]?.originalname || '',
        },
        pan: {
          status: 'PENDING',
          url: req.files?.panImage?.[0]?.originalname || '',
        },
      },
    });

    await reviewRequest.save();

    // Create partner with PENDING_APPROVAL status
    const partner = new DeliveryPartner({
      userId,
      mobileNumber,
      aadharNumber,
      panNumber,
      status: 'PENDING_APPROVAL',
    });

    await partner.save();

    // Update user role
    await User.findByIdAndUpdate(userId, { role: 'partner' });

    res.status(201).json({
      success: true,
      message: 'Your details are under review. We will contact you soon.',
      data: {
        partnerId: partner._id,
        name,
        status: 'PENDING_APPROVAL',
        reviewRequestId: reviewRequest._id,
      },
    });
  })
);

// Add Vehicle
router.post(
  '/:partnerId/vehicles',
  upload.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'insurance', maxCount: 1 },
    { name: 'pollution', maxCount: 1 },
    { name: 'vehiclePhoto', maxCount: 1 },
  ]),
  asyncHandler(async (req, res) => {
    const { partnerId } = req.params;
    const { vehicleType, vehicleNumber } = req.body;

    if (!vehicleType || !vehicleNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check vehicle capacity
    const capacityMap = { bike: 5, scooter: 10, auto: 50 };

    const vehicle = new Vehicle({
      partnerId,
      vehicleType,
      vehicleNumber,
      registrationCertificate: {
        url: req.files?.registrationCertificate?.[0]?.originalname || '',
      },
      insuranceCertificate: {
        url: req.files?.insurance?.[0]?.originalname || '',
      },
      pollutionCertificate: {
        url: req.files?.pollution?.[0]?.originalname || '',
      },
      vehiclePhoto: {
        url: req.files?.vehiclePhoto?.[0]?.originalname || '',
      },
      capacity: capacityMap[vehicleType],
      status: 'ACTIVE',
    });

    await vehicle.save();

    // Add vehicle to partner
    await DeliveryPartner.findByIdAndUpdate(
      partnerId,
      { $push: { vehicles: vehicle._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      data: {
        vehicleId: vehicle._id,
        vehicleType,
        vehicleNumber,
        status: 'ACTIVE',
      },
    });
  })
);

// Set Service Area
router.post(
  '/:partnerId/service-area',
  asyncHandler(async (req, res) => {
    const { partnerId } = req.params;
    const { center, radius, serviceAreas } = req.body;

    if (!center || !radius || !serviceAreas) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const partner = await DeliveryPartner.findByIdAndUpdate(
      partnerId,
      {
        serviceArea: {
          center,
          radius,
          areas: serviceAreas.map((area) => area.area),
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: {
        partnerId,
        serviceArea: partner.serviceArea,
      },
    });
  })
);

// Get Partner Profile
router.get(
  '/:partnerId',
  asyncHandler(async (req, res) => {
    const { partnerId } = req.params;

    const partner = await DeliveryPartner.findById(partnerId)
      .populate('userId', 'name email phone')
      .populate('vehicles');

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        partnerId: partner._id,
        name: partner.userId.name,
        mobileNumber: partner.mobileNumber,
        city: partner.userId.city,
        status: partner.status,
        rating: partner.rating,
        totalDeliveries: partner.totalDeliveries,
        vehicles: partner.vehicles,
        serviceArea: partner.serviceArea,
      },
    });
  })
);

// Update Partner Status (ONLINE/OFFLINE/ON_BREAK)
router.put(
  '/:partnerId/status',
  asyncHandler(async (req, res) => {
    const { partnerId } = req.params;
    const { status, currentLocation } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }

    const partner = await DeliveryPartner.findByIdAndUpdate(
      partnerId,
      {
        currentStatus: status,
        currentLocation: {
          ...currentLocation,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: {
        partnerId,
        status: partner.currentStatus,
        lastUpdated: new Date(),
      },
    });
  })
);

// Get Partner Performance
router.get(
  '/:partnerId/performance',
  asyncHandler(async (req, res) => {
    const { partnerId } = req.params;

    const partner = await DeliveryPartner.findById(partnerId).populate('userId');

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
          rating: partner.rating,
          onTimeDelivery: partner.onTimeDeliveryPercentage,
          cancellationRate: partner.cancellationRate,
        },
        currentStatus: partner.currentStatus,
        totalEarnings: partner.totalEarnings,
        monthlyEarnings: partner.monthlyEarnings,
      },
    });
  })
);

export default router;
