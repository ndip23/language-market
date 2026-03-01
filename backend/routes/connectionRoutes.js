const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Protect route, student must be logged in
const User = require('../models/User');
const Connection = require('../models/Connection');

// @route   POST /api/connections/request
// @desc    Student requests a teacher (Enforces Sub limits)
router.post('/request', auth, async (req, res) => {
  try {
    const { teacherId } = req.body;
    const studentId = req.user.id; 

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ msg: "Teacher not found" });
    }

    // 1. Check Limits (Basic = 6, Pro = 20)
    const { subscriptionPlan, currentMonthStudentCount } = teacher.teacherProfile;
    const limit = subscriptionPlan === 'pro' ? 20 : (subscriptionPlan === 'basic' ? 6 : 0);

    if (currentMonthStudentCount >= limit) {
      return res.status(400).json({ msg: "This teacher has reached their student limit for the month. Try again next month!" });
    }

    // 2. Create Connection Document
    const newConnection = new Connection({
      student: studentId,
      teacher: teacherId,
      paymentMethodUsed: teacher.teacherProfile.paymentPreference,
      status: 'pending'
    });
    await newConnection.save();

    // 3. Increment Teacher's Student Count
    teacher.teacherProfile.currentMonthStudentCount += 1;
    await teacher.save();

    res.status(200).json({ msg: "Teacher contacted successfully!", connection: newConnection });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;