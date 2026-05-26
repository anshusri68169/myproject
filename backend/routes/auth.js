import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// Register User (Customer)
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, phone, password, role, name, address } = req.body;

    // Validation
    if (!email || !phone || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create new user
    const user = new User({
      email,
      phone,
      password,
      role: 'customer',
      name,
      address: address || {},
      city: 'Lucknow',
    });

    await user.save();

    // Generate tokens
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        token,
        refreshToken,
      },
    });
  })
);

// Register Partner
router.post(
  '/register/partner',
  asyncHandler(async (req, res) => {
    const { 
      email, 
      phone, 
      password, 
      name, 
      address, 
      vehicleDetails, 
      bankDetails 
    } = req.body;

    // Validation
    if (!email || !phone || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!vehicleDetails || !vehicleDetails.registrationNumber) {
      return res.status(400).json({ error: 'Vehicle details required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create new partner user
    const user = new User({
      email,
      phone,
      password,
      role: 'partner',
      name,
      address: address || {},
      city: address?.city || 'Lucknow',
      vehicleDetails: {
        type: vehicleDetails.type,
        registrationNumber: vehicleDetails.registrationNumber,
        capacity: vehicleDetails.capacity,
      },
      bankDetails: bankDetails || {},
      status: 'pending', // Partners need approval
    });

    await user.save();

    // Generate tokens
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Partner registration successful. Awaiting admin approval.',
      data: {
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        status: user.status,
        token,
        refreshToken,
      },
    });
  })
);

// Register Enterprise
router.post(
  '/register/enterprise',
  asyncHandler(async (req, res) => {
    const { 
      email, 
      phone, 
      password, 
      name, 
      address, 
      companyName,
      registrationNumber,
      gstNumber
    } = req.body;

    // Validation
    if (!email || !phone || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!companyName || !registrationNumber) {
      return res.status(400).json({ error: 'Company details required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create new enterprise user
    const user = new User({
      email,
      phone,
      password,
      role: 'enterprise',
      name,
      address: address || {},
      city: address?.city || 'Lucknow',
      companyName,
      registrationNumber,
      gstNumber,
      status: 'pending', // Enterprises need approval
    });

    await user.save();

    // Generate tokens
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Enterprise registration successful. Awaiting admin approval.',
      data: {
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        companyName: user.companyName,
        status: user.status,
        token,
        refreshToken,
      },
    });
  })
);

// Login User
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    res.status(200).json({
      success: true,
      data: {
        token,
        refreshToken,
        user: {
          userId: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
      },
    });
  })
);

// Refresh Token
router.post(
  '/refresh-token',
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const newToken = generateToken(decoded.userId, decoded.role);

      res.status(200).json({
        success: true,
        data: { token: newToken },
      });
    } catch (error) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
  })
);

// Logout
router.post('/logout', asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
}));

// Get Profile
router.get(
  '/profile',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    });
  })
);

export default router;
