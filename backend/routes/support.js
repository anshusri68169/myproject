import express from 'express';
import multer from 'multer';
import SupportTicket from '../models/SupportTicket.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Generate Ticket ID
const generateTicketId = () => {
  const timestamp = Date.now().toString().slice(-6);
  return `TKT_${timestamp}`;
};

// Create Support Ticket
router.post(
  '/tickets',
  upload.array('attachments', 5),
  asyncHandler(async (req, res) => {
    const { subject, category, priority, description } = req.body;
    const userId = req.user.userId;

    if (!subject || !category || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const ticketId = generateTicketId();
    const ticket = new SupportTicket({
      ticketId,
      userId,
      subject,
      category,
      priority: priority || 'MEDIUM',
      description,
      attachments: req.files?.map((file) => ({
        url: file.originalname,
      })) || [],
    });

    await ticket.save();

    res.status(201).json({
      success: true,
      data: {
        ticketId: ticket.ticketId,
        status: ticket.status,
        subject,
        priority,
        createdAt: ticket.createdAt,
        estimatedResolutionTime: '24 hours',
      },
    });
  })
);

// Get Support Tickets
router.get(
  '/tickets',
  asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { userId };
    if (status) filter.status = status;

    const tickets = await SupportTicket.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await SupportTicket.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        total,
        page: Number(page),
        limit: Number(limit),
        tickets: tickets.map((ticket) => ({
          ticketId: ticket.ticketId,
          subject: ticket.subject,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt,
        })),
      },
    });
  })
);

// Send Chat Message
router.post(
  '/tickets/:ticketId/messages',
  asyncHandler(async (req, res) => {
    const { ticketId } = req.params;
    const { message } = req.body;
    const userId = req.user.userId;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const ticket = await SupportTicket.findOneAndUpdate(
      { ticketId },
      {
        $push: {
          messages: {
            sender: userId,
            message,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.status(201).json({
      success: true,
      data: {
        ticketId,
        message,
        timestamp: new Date(),
      },
    });
  })
);

// Close Ticket
router.put(
  '/tickets/:ticketId/close',
  asyncHandler(async (req, res) => {
    const { ticketId } = req.params;

    const ticket = await SupportTicket.findOneAndUpdate(
      { ticketId },
      { status: 'CLOSED', actualResolutionTime: new Date() },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket closed successfully',
      data: {
        ticketId: ticket.ticketId,
        status: ticket.status,
      },
    });
  })
);

export default router;
