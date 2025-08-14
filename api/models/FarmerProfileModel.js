// models/FarmerProfile.js (Backend - MongoDB/Mongoose)
const mongoose = require('mongoose');

const businessHoursSchema = {
  open: {
    type: String,
    default: '',
  },
  close: {
    type: String,
    default: '',
  },
};

const farmerProfileSchema = mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    farmName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    establishedYear: {
      type: String,
      default: '',
    },
    farmingPractices: {
      type: [String],
      default: [],
    },
    businessHours: {
      monday: { type: businessHoursSchema, default: {} },
      tuesday: { type: businessHoursSchema, default: {} },
      wednesday: { type: businessHoursSchema, default: {} },
      thursday: { type: businessHoursSchema, default: {} },
      friday: { type: businessHoursSchema, default: {} },
      saturday: { type: businessHoursSchema, default: {} },
      sunday: { type: businessHoursSchema, default: {} },
    },
    deliveryRadius: {
      type: String,
      default: '',
    },
    minOrderValue: {
      type: String,
      default: '',
    },
    paymentMethods: {
      type: [String],
      default: [],
    },
    profileImage: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FarmerProfile', farmerProfileSchema);
