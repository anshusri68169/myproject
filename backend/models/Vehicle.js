import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryPartner',
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ['bike', 'scooter', 'auto'],
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleColor: String,
    vehicleBrand: String,
    vehicleModel: String,
    registrationCertificate: {
      url: String,
      key: String,
      expiryDate: Date,
    },
    insuranceCertificate: {
      url: String,
      key: String,
      expiryDate: Date,
    },
    pollutionCertificate: {
      url: String,
      key: String,
      expiryDate: Date,
    },
    vehiclePhoto: {
      url: String,
      key: String,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE', 'EXPIRED_DOCS'],
      default: 'ACTIVE',
    },
    capacity: {
      type: Number, // kg
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
