import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables FIRST - before importing routes
dotenv.config();

import mongoConnection from './config/database.js';
import authRoutes from './routes/auth.js';
import partnerRoutes from './routes/partners.js';
import enterpriseRoutes from './routes/enterprises.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import supportRoutes from './routes/support.js';
import walletRoutes from './routes/wallet.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authenticate } from './middleware/auth.js';

// Validate critical environment variables
const requiredEnvVars = [
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'MONGODB_URI',
];

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach((envVar) => {
    console.error(`   - ${envVar}`);
  });
  console.error('\nPlease check your backend/.env file');
  process.exit(1);
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Database Connection
mongoConnection();

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('leave_room', (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ===== DEBUG ROUTES (Remove in production) =====

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running', timestamp: new Date() });
});

// Debug Environment Variables
app.get('/debug/env', (req, res) => {
  res.status(200).json({
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET_SET: !!process.env.JWT_SECRET,
    JWT_SECRET_LENGTH: process.env.JWT_SECRET?.length || 0,
    JWT_REFRESH_SECRET_SET: !!process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_SECRET_LENGTH: process.env.JWT_REFRESH_SECRET?.length || 0,
    MONGODB_URI_SET: !!process.env.MONGODB_URI,
    FRONTEND_URL: process.env.FRONTEND_URL,
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL,
  });
});

// ===== END DEBUG ROUTES =====

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/partners', authenticate, partnerRoutes);
app.use('/api/enterprises', authenticate, enterpriseRoutes);
app.use('/api/orders', authenticate, orderRoutes);
app.use('/api/admin', authenticate, adminRoutes);
app.use('/api/support', authenticate, supportRoutes);
app.use('/api/wallet', authenticate, walletRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`\n✅ QuickLift Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔐 JWT_SECRET loaded: ${!!process.env.JWT_SECRET}`);
  console.log(`🔄 MONGODB_URI loaded: ${!!process.env.MONGODB_URI}`);
  console.log(`\n📝 Debug endpoint: http://localhost:${PORT}/debug/env`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health\n`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { io };
