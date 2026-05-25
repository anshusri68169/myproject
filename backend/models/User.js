import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['customer', 'partner', 'enterprise', 'admin'],
      default: 'customer',
    },
    city: {
      type: String,
      default: 'Lucknow',
    },
    avatar: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    wallet: {
      balance: {
        type: Number,
        default: 0,
      },
      totalEarnings: {
        type: Number,
        default: 0,
      },
    },
    // Partner specific fields
    partnerDetails: {
      vehicleType: String,
      vehicleNumber: String,
      licenseNumber: String,
      isApproved: Boolean,
      rating: {
        type: Number,
        default: 0,
      },
      totalOrders: {
        type: Number,
        default: 0,
      },
      completedOrders: {
        type: Number,
        default: 0,
      },
    },
    // Enterprise specific fields
    enterpriseDetails: {
      companyName: String,
      gstNumber: String,
      businessType: String,
      isApproved: Boolean,
      maxOrdersPerDay: {
        type: Number,
        default: 100,
      },
      monthlyBudget: {
        type: Number,
        default: 50000,
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const hashedPassword = await bcryptjs.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
