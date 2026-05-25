import express from 'express';
import Wallet from '../models/Wallet.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Get Wallet Balance
router.get(
  '/:userId',
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = new Wallet({ userId, balance: 0 });
      await wallet.save();
    }

    res.status(200).json({
      success: true,
      data: {
        walletId: wallet._id,
        userId,
        balance: wallet.balance,
        currency: wallet.currency,
        lastUpdated: wallet.lastUpdated,
        transactions: wallet.transactions.slice(-10), // Last 10 transactions
      },
    });
  })
);

// Add Money to Wallet
router.post(
  '/:userId/add-money',
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { amount, paymentMethod, orderId } = req.body;

    if (!amount || !paymentMethod) {
      return res.status(400).json({ error: 'Amount and payment method required' });
    }

    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = new Wallet({ userId });
    }

    const transactionId = `TXN_${Date.now()}`;

    // Add transaction
    wallet.transactions.push({
      transactionId,
      type: 'CREDIT',
      amount,
      reason: 'Add Money',
      referenceId: orderId,
      status: 'SUCCESS',
    });

    wallet.balance += amount;
    wallet.lastUpdated = new Date();

    await wallet.save();

    res.status(200).json({
      success: true,
      data: {
        transactionId,
        status: 'SUCCESS',
        amount,
        walletBalance: wallet.balance,
        timestamp: new Date(),
      },
    });
  })
);

// Get Transaction History
router.get(
  '/:userId/transactions',
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const transactions = wallet.transactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice((page - 1) * limit, page * limit);

    res.status(200).json({
      success: true,
      data: {
        userId,
        balance: wallet.balance,
        transactions,
        total: wallet.transactions.length,
        page: Number(page),
        limit: Number(limit),
      },
    });
  })
);

export default router;
