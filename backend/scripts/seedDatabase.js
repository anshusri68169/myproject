import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Order from '../models/Order.js';
import DeliveryPartner from '../models/DeliveryPartner.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quicklift');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Order.deleteMany({});
    await DeliveryPartner.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Hash passwords
    const hashedPassword = await bcrypt.hash('Test@12345', 10);

    // Create test users
    const users = await User.insertMany([
      {
        email: 'customer@test.com',
        phone: '9876543210',
        password: hashedPassword,
        role: 'customer',
        name: 'Test Customer',
        city: 'Lucknow',
        isActive: true,
        verificationStatus: 'VERIFIED',
      },
      {
        email: 'partner@test.com',
        phone: '9876543211',
        password: hashedPassword,
        role: 'partner',
        name: 'Test Partner',
        city: 'Lucknow',
        isActive: true,
        verificationStatus: 'VERIFIED',
      },
      {
        email: 'enterprise@test.com',
        phone: '9876543212',
        password: hashedPassword,
        role: 'enterprise',
        name: 'Test Enterprise',
        city: 'Lucknow',
        isActive: true,
        verificationStatus: 'VERIFIED',
      },
      {
        email: 'admin@test.com',
        phone: '9876543213',
        password: hashedPassword,
        role: 'admin',
        name: 'Admin User',
        city: 'Lucknow',
        isActive: true,
        verificationStatus: 'VERIFIED',
      },
    ]);

    console.log('✅ Created test users:');
    users.forEach((user) => {
      console.log(`   - ${user.role}: ${user.email} / Test@12345`);
    });

    // Create test orders
    const orders = await Order.insertMany([
      {
        customerId: users[0]._id,
        partnerId: users[1]._id,
        pickupLocation: { address: '123 Main St, Lucknow', coordinates: [26.8467, 80.9462] },
        deliveryLocation: { address: '456 Park Ave, Lucknow', coordinates: [26.8500, 80.9500] },
        itemDescription: 'Electronics Package',
        weight: 2.5,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        totalAmount: 150,
        createdAt: new Date(),
      },
      {
        customerId: users[0]._id,
        partnerId: users[1]._id,
        pickupLocation: { address: '789 Oak St, Lucknow', coordinates: [26.8400, 80.9400] },
        deliveryLocation: { address: '321 Elm St, Lucknow', coordinates: [26.8350, 80.9350] },
        itemDescription: 'Documents',
        weight: 0.5,
        status: 'IN_TRANSIT',
        paymentStatus: 'PAID',
        totalAmount: 75,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        customerId: users[0]._id,
        partnerId: users[1]._id,
        pickupLocation: { address: '555 Pine St, Lucknow', coordinates: [26.8600, 80.9600] },
        deliveryLocation: { address: '777 Cedar St, Lucknow', coordinates: [26.8700, 80.9700] },
        itemDescription: 'Clothing',
        weight: 1.2,
        status: 'DELIVERED',
        paymentStatus: 'PAID',
        totalAmount: 120,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
    ]);

    console.log('✅ Created 3 test orders');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('========================================');
    console.log('Customer:  customer@test.com / Test@12345');
    console.log('Partner:   partner@test.com / Test@12345');
    console.log('Enterprise: enterprise@test.com / Test@12345');
    console.log('Admin:     admin@test.com / Test@12345');
    console.log('========================================\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();