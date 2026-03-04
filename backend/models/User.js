const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  profilePicture: { type: String, default: '' },
  savedTeachers: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mobile: { type: String, required: true },
  countryCode: { type: String, default: 'CM' },
  balance: { type: Number, default: 0 },
  // Teacher Specific Data
  teacherProfile: {
    language: { type: String, enum: ['English', 'French'] },
    bio: String,
    experience: Number,
    pricePerLesson: Number,
    isApproved: { type: Boolean, default: false },
    paymentPreference: { type: String, enum: ['external', 'platform'], default: 'external' },
    gallery: [String],
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 5.0 },
    stripeAccountId: String // For Connect Payouts
  },

  // Subscription Engine
  subscription: {
    plan: { type: String, enum: ['none', 'basic', 'pro'], default: 'none' },
    stripeSubscriptionId: String,
    studentLimit: { type: Number, default: 0 }, // 6 or 20
    currentConnections: { type: Number, default: 0 },
    activeUntil: Date,
    status: {
      type: String,
      enum: ['none', 'pending_approval', 'active', 'inactive'],
      default: 'none'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);