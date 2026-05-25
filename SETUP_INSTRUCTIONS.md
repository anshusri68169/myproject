# QuickLift Local Setup Guide 🚀

Complete step-by-step guide to launch QuickLift at `http://localhost:5173`

---

## 📋 Prerequisites

Before starting, ensure you have installed:

1. **Node.js v16+** - [Download](https://nodejs.org/)
2. **MongoDB v4.4+** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas Cloud](https://www.mongodb.com/cloud/atlas)
3. **Git** - [Download](https://git-scm.com/)
4. **npm** or **yarn** - Comes with Node.js

### Verify Installation:
```bash
node --version    # Should show v16 or higher
npm --version     # Should show 8 or higher
mongod --version  # Should show MongoDB version
```

---

## 🔧 Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Amitsri68169/QuickLift.git

# Navigate to project directory
cd QuickLift
```

---

## 📦 Step 2: Install Dependencies

### Install Backend Dependencies:
```bash
cd backend
npm install
cd ..
```

### Install Frontend Dependencies:
```bash
cd frontend
npm install
cd ..
```

**Note:** Environment files (`.env` and `frontend/.env`) are already configured in the repository root for local development.

---

## 🗄️ Step 3: Setup MongoDB

### Option A: MongoDB Local Installation (Recommended for Development)

**On Windows:**
```bash
# MongoDB should auto-start as a service
# Check if running:
netstat -ano | findstr 27017
```

**On Mac:**
```bash
# Start MongoDB with Homebrew
brew services start mongodb-community

# Stop (if needed)
brew services stop mongodb-community
```

**On Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod
sudo systemctl status mongod
```

### Option B: MongoDB Atlas (Cloud - No Installation Needed)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a cluster
4. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/quicklift`
5. Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/quicklift
```

### Verify MongoDB Connection:
```bash
# Using MongoDB client
mongosh
# or
mongo

# In MongoDB shell:
> show dbs
> use quicklift
> db.users.find()
```

---

## 🚀 Step 4: Start the Backend Server

### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ QuickLift Server running on port 5000
🌍 Environment: development
Server is listening on http://localhost:5000
```

**Test Backend Health:**
```bash
curl http://localhost:5000/health
```

Expected Response:
```json
{
  "message": "Server is running",
  "timestamp": "2026-05-19T10:30:00.000Z"
}
```

---

## 🎨 Step 5: Start the Frontend Server

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v4.x.x  ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## ✅ Step 6: Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

🎉 **QuickLift is now running!**

---

## 🧪 Testing the Application

### Test Default Users (Create these first):

**Customer Account:**
```bash
Email: customer@test.com
Password: TestPassword123
```

**Delivery Partner Account:**
```bash
Email: partner@test.com
Password: TestPassword123
```

**Admin Account:**
```bash
Email: admin@test.com
Password: TestPassword123
```

### Quick Test Endpoints (Using Postman/Curl):

**1. Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "email": "customer@test.com",
    "phone": "9876543210",
    "password": "TestPassword123",
    "role": "customer"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "TestPassword123"
  }'
```

**3. Health Check:**
```bash
curl http://localhost:5000/health
```

---

## 📁 Project Structure

```
QuickLift/
├── backend/                    # Node.js + Express backend
│   ├── server.js              # Main server file
│   ├── config/                # Database config
│   ├── routes/                # API routes
│   ├── models/                # MongoDB schemas
│   ├── middleware/            # Auth, error handling
│   ├── controllers/           # Business logic
│   ├── .env                   # Configuration (local)
│   └── package.json
│
├── frontend/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Redux state
│   │   ├── services/         # API calls
│   │   └── App.jsx           # Root component
│   ├── vite.config.js         # Vite configuration
│   ├── .env                   # Configuration (local)
│   └── package.json
│
├── docker-compose.yml         # Docker setup (optional)
├── .env                       # Root env file
├── .env.example              # Example env file
└── README.md                 # Documentation

```

---

## 🔍 Troubleshooting

### Issue: Port 5000 already in use
```bash
# Find and kill process using port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

### Issue: Port 5173 already in use
```bash
# Same as above but for port 5173
```

### Issue: MongoDB Connection Error
```bash
# Verify MongoDB is running
mongosh

# If not running, start it:
# Windows: mongod
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Issue: Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: CORS Error
- Ensure backend `.env` has: `FRONTEND_URL=http://localhost:5173`
- Ensure frontend `.env` has: `VITE_API_BASE_URL=http://localhost:5000/api`

### Issue: WebSocket Connection Failed
- Ensure backend Socket.io is running on port 5000
- Check frontend `.env`: `VITE_SOCKET_URL=http://localhost:5000`

---

## 📊 Monitoring & Debugging

### View Backend Logs:
```bash
# Enable debug logs
DEBUG=* npm run dev
```

### View Database:
```bash
mongosh
> use quicklift
> db.users.find().pretty()
> db.orders.find().pretty()
```

### Browser DevTools:
- **React DevTools** - Install extension from Chrome Web Store
- **Redux DevTools** - Already configured in Redux Toolkit
- **Network Tab** - Monitor API calls
- **Console** - Check for errors

---

## 🚢 Next Steps (Production)

1. **Build Frontend:** `cd frontend && npm run build`
2. **Set up environment variables** for production
3. **Deploy using Docker:** `docker-compose up`
4. **Deploy to AWS/Heroku/DigitalOcean**
5. **Setup CI/CD pipeline with GitHub Actions**

---

## 📞 Support

For issues or questions:
- Check the [main README.md](./README.md)
- Review API documentation in [QuickLift-API.postman_collection.json](./QuickLift-API.postman_collection.json)
- Check browser console for errors
- Check terminal logs for backend errors

---

## ✨ Features to Test

- [ ] User Registration & Login
- [ ] Delivery Partner Registration
- [ ] Order Creation & Tracking
- [ ] Real-time Order Updates (WebSocket)
- [ ] Admin Dashboard
- [ ] Enterprise Features
- [ ] Payment/Wallet Integration
- [ ] Support Tickets
- [ ] Document Verification

---

**Happy Coding! 🚀**

Last Updated: 2026-05-19
