const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
  meetingLink: { type: String, default: '' },
  // Payment tracking
  paymentMethodUsed: { type: String, enum: ['external', 'platform'], required: true },
  amountPaid: { type: Number, default: 0 },
  platformCommission: { type: Number, default: 0 }, // 15% if platform, 0 if external
  teacherEarnings: { type: Number, default: 0 },
  
  isPaid: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Connection', connectionSchema);