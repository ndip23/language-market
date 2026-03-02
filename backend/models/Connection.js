const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
  isPaid: { type: Boolean, default: false },
  meetingLink: { type: String, default: '' },
  pricing: {
    grossAmount: Number,
    platformCommission: Number,
    teacherEarnings: Number,
    currency: String
  }
}, { timestamps: true });

// 🚨 ENSURE THIS LINE IS EXACTLY LIKE THIS:
module.exports = mongoose.model('Connection', connectionSchema);