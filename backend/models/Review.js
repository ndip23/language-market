const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true }
}, { timestamps: true });

// Auto-calculate teacher rating after a review is saved
reviewSchema.post('save', async function() {
  const stats = await this.constructor.aggregate([
    { $match: { teacher: this.teacher } },
    { $group: { _id: '$teacher', avgRating: { $avg: '$rating' } } }
  ]);
  await mongoose.model('User').findByIdAndUpdate(this.teacher, {
    'teacherProfile.rating': stats[0].avgRating.toFixed(1)
  });
});

module.exports = mongoose.model('Review', reviewSchema);