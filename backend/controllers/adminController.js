const User = require('../models/User');
const Connection = require('../models/Connection');

// @desc    Approve or Suspend a teacher
// @route   PUT /api/admin/teacher/:id/status
exports.updateTeacherStatus = async (req, res) => {
  try {
    const { isApproved } = req.body; // true or false
    
    const teacher = await User.findById(req.params.id);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ msg: 'Teacher not found' });
    }

    teacher.teacherProfile.isApproved = isApproved;
    await teacher.save();

    res.json({ msg: `Teacher status updated to ${isApproved ? 'Approved' : 'Suspended'}`, teacher });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
exports.getPlatformStats = async (req, res) => {
  try {
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalConnections = await Connection.countDocuments();
    
    // Sum up all platform commissions earned
    const connectionsWithCommission = await Connection.find({ platformCommission: { $gt: 0 } });
    const totalRevenue = connectionsWithCommission.reduce((acc, curr) => acc + curr.platformCommission, 0);

    res.json({
      totalTeachers,
      totalStudents,
      totalConnections,
      totalRevenueEarned: totalRevenue
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
// @desc    Get ALL teachers (Approved and Pending) for Admin
// @route   GET /api/admin/teachers
exports.getAllTeachersForAdmin = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password');
    res.json(teachers);
  } catch (err) {
    res.status(500).send('Server Error');
  }
}
exports.toggleFeatured = async (req, res) => {
  const teacher = await User.findById(req.params.id);
  teacher.teacherProfile.isFeatured = !teacher.teacherProfile.isFeatured;
  await teacher.save();
  res.json({ msg: "Teacher featured status updated" });
};

// Suspend an account (block login)
exports.toggleSuspension = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isActive = !user.isActive; // isActive defaults to true
  await user.save();
  res.json({ msg: `Account ${user.isActive ? 'restored' : 'suspended'}` });
};