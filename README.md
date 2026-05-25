# QuickLift - Last Mile Delivery Platform 🚲

**Location:** Lucknow, Uttar Pradesh | **Service Area:** City + 20km radius  
**Transport:** 2-Wheeler Delivery Network | **Status:** Production Ready

---

## 🌟 Platform Overview

QuickLift is a tech-enabled last-mile delivery platform connecting delivery partners (bike/scooter riders) with enterprises and customers in Lucknow. The platform ensures transparent pricing, real-time tracking, and automated partner assignment based on service areas.

### Key USPs:
- ⚡ **Fast Delivery** - 2-wheeler fleet for speed
- 💰 **Transparent Pricing** - No hidden charges
- 🗺️ **Real-time Tracking** - GPS-based live updates
- 🤖 **Smart Assignment** - Auto-match by service area
- ✅ **Verified Partners** - PAN/Aadhar verification mandatory
- 📱 **Multi-platform** - Web + Mobile ready

---

## 👥 User Roles

### 1. **Delivery Partners**
- Register bike/scooter with documents
- Select service area (20km radius)
- Accept/reject delivery orders
- Track earnings in real-time
- View trip history and ratings

### 2. **Enterprises**
- Bulk order placement
- Centralized logistics dashboard
- Real-time trip tracking
- Payment & invoice management
- User and driver management
- Analytics & reporting

### 3. **Customers**
- Book 2-wheeler delivery
- Select vehicle type by load size
- Prepaid wallet system
- Real-time GPS tracking
- OTP verification
- Delivery proof capture

### 4. **Admin**
- Approve/reject partners & enterprises
- Document verification (PAN/Aadhar)
- Order management & monitoring
- Partner performance tracking
- Support ticket management
- Analytics & insights

---

## ✨ Core Features

### **Partner Management**
- ✅ Multi-vehicle registration with checkboxes
- ✅ Service area selection (20km radius coverage map)
- ✅ PAN/Aadhar verification with image upload
- ✅ Real-time status updates
- ✅ Performance ratings & analytics
- ✅ Earnings dashboard with wallet

### **Order Management**
- ✅ Auto-assignment based on service area
- ✅ Multiple order statuses (Pending → Scheduled → In-Progress → Completed/Cancelled)
- ✅ Cost estimation with breakdown
- ✅ Real-time GPS tracking
- ✅ OTP verification at pickup & delivery
- ✅ Delivery proof with photos/signature

### **Enterprise Features**
- ✅ Bulk order upload
- ✅ Centralized dashboard
- ✅ Custom delivery slots
- ✅ Payment reconciliation
- ✅ Performance analytics
- ✅ User management

### **Admin Panel**
- ✅ Pending request review queue
- ✅ Document verification interface
- ✅ Approve/Reject/On Hold workflow
- ✅ Order status dashboard
- ✅ Partner performance metrics
- ✅ Financial reports
- ✅ Support ticket management

### **Payment & Wallet**
- ✅ Prepaid wallet system
- ✅ Real-time wallet updates
- ✅ Transaction history
- ✅ Multiple payment methods (Razorpay)
- ✅ Auto-settlement for partners

### **Support System**
- ✅ Floating support button (all pages)
- ✅ Live chat support
- ✅ Ticket creation & tracking
- ✅ Help center & FAQs
- ✅ Priority levels

### **Real-time Features**
- ✅ WebSocket for live notifications
- ✅ Order status updates
- ✅ GPS tracking stream
- ✅ Chat messages
- ✅ Earnings updates

---

## 🏗️ Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB (NoSQL Database)
- Socket.io (Real-time)
- JWT (Authentication)
- Mongoose (ODM)
- Razorpay (Payments)

**Frontend:**
- React.js + Vite
- Redux Toolkit (State Management)
- TailwindCSS (Styling)
- Axios (HTTP Client)
- Mapbox/Google Maps (GPS)
- Socket.io Client (Real-time)

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- AWS S3 (File Storage)
- Firebase Cloud Messaging (Push Notifications)

---

## 📋 API Endpoints (26 Total)

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### **Delivery Partners**
- `POST /api/partners/register` - Register as delivery partner
- `GET /api/partners/:id` - Get partner details
- `PUT /api/partners/:id` - Update partner profile
- `POST /api/partners/:id/vehicles` - Add vehicle

### **Enterprises**
- `POST /api/enterprises/register` - Register as enterprise
- `GET /api/enterprises/:id` - Get enterprise details
- `PUT /api/enterprises/:id` - Update enterprise profile

### **Orders**
- `POST /api/orders` - Create order
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/track` - Get real-time tracking

### **Admin**
- `GET /api/admin/requests/pending` - Pending approvals
- `PUT /api/admin/requests/:id/approve` - Approve request
- `PUT /api/admin/requests/:id/reject` - Reject request
- `POST /api/admin/verify-documents` - Verify PAN/Aadhar
- `GET /api/admin/orders` - All orders
- `GET /api/admin/partners` - All partners
- `GET /api/admin/analytics` - Analytics data

### **Support**
- `POST /api/support/tickets` - Create support ticket
- `GET /api/support/tickets` - List tickets
- `POST /api/support/chat` - Send chat message

### **Wallet**
- `GET /api/wallet/:userId` - Get wallet balance
- `POST /api/wallet/add-money` - Add money to wallet

---

## 🗄️ Database Models

**10 Core Collections:**

1. **User** - Base user model (email, phone, role)
2. **DeliveryPartner** - Partner details, vehicles, service area
3. **Enterprise** - Business profile, settings
4. **Order** - Order details, pricing, tracking
5. **Vehicle** - Bike/scooter inventory
6. **ReviewRequest** - Partner/enterprise approval queue
7. **Wallet** - Prepaid wallet, transactions
8. **SupportTicket** - Help requests, tickets
9. **Admin** - Admin users, permissions
10. **Analytics** - Business metrics, reports

---

## 🚀 Quick Start

### **Prerequisites:**
- Node.js v16+
- MongoDB v4.4+
- Razorpay Account
- Mapbox API Key

### **Installation:**

```bash
# Clone repository
git clone https://github.com/Amitsri68169/QuickLift.git
cd QuickLift

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start development servers
cd backend
npm run dev

# In another terminal
cd frontend
npm run dev
