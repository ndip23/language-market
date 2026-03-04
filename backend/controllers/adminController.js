const User = require('../models/User');
const Connection = require('../models/Connection');
const sendEmail = require('../utils/sendEmail');

// @desc    Approve or Suspend a teacher
// @route   PUT /api/admin/teacher/:id/status
// 1. APPROVE TEACHER & SEND MODERN EMAIL
exports.updateTeacherStatus = async (req, res) => {
  try {
    const { isApproved } = req.body;

    const teacher = await User.findById(req.params.id);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ msg: 'Teacher not found' });
    }

    // Update DB status
    teacher.teacherProfile.isApproved = isApproved;

    // If approved, set subscription to active
    if (isApproved) {
      teacher.subscription.status = 'active';
    }

    await teacher.save();

    // 📧 SEND MODERNIZED EMAIL
    if (isApproved) {
      console.log(`👤 ADMIN ACTION: Approving Teacher ID: ${teacher._id} (${teacher.name})`);
      const emailMessage = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 50px; color: #0f172a;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 32px; padding: 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="background-color: #10b981; color: white; width: 60px; height: 60px; line-height: 60px; border-radius: 20px; display: inline-block; font-size: 30px;">L</div>
                    </div>
                    <h1 style="font-size: 28px; font-weight: 900; text-align: center; letter-spacing: -1px; margin-bottom: 10px;">Account Activated.</h1>
                    <p style="text-align: center; color: #64748b; font-size: 16px; margin-bottom: 30px;">Congratulations ${teacher.name}, your professional profile is now live on the marketplace.</p>
                    
                    <div style="background-color: #ecfdf5; border-radius: 24px; padding: 25px; margin-bottom: 30px; border: 1px solid #d1fae5;">
                        <h4 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #059669;">Next Steps</h4>
                        <p style="margin: 0; font-size: 14px; color: #065f46; line-height: 1.6;">Students can now discover your profile, message you directly, and book sessions. Please ensure your bio and rates are up to date.</p>
                    </div>

                    <a href="https://learnlanguagehelp.site/login" style="display: block; text-align: center; background-color: #0f172a; color: #ffffff; padding: 20px; border-radius: 18px; text-decoration: none; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">
                        View My Professional Profile
                    </a>

                    <p style="text-align: center; font-size: 10px; color: #94a3b8; margin-top: 30px; text-transform: uppercase; letter-spacing: 1px;">
                        © 2026 LangConnect Elite Marketplace
                    </p>
                </div>
            </div>
        `;

      try {
        await sendEmail({
          email: teacher.email,
          subject: "✅ Profile Approved: Welcome to LangConnect Elite",
          message: emailMessage
        });
        console.log(`✨ NOTIFICATION: Approval email dispatched to ${teacher.name}`);
      } catch (mailErr) {
        console.error("⚠️ SYSTEM WARNING: User approved but notification email failed.");
      }
    }

    res.json({ msg: `Teacher status updated to ${isApproved ? 'Approved' : 'Suspended'}`, teacher });
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
exports.getAdminUsers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password');
    const rawStudents = await User.find({ role: 'student' }).select('-password');

    // 🚨 ENHANCEMENT: For every student, find their teacher connections
    const students = await Promise.all(rawStudents.map(async (student) => {
        const connections = await Connection.find({ student: student._id })
            .populate('teacher', 'name profilePicture teacherProfile')
            .select('isPaid status teacher');
        
        return {
            ...student._doc,
            bookedTutors: connections // Attach the list of tutors they are working with
        };
    }));

    res.json({ teachers, students });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// 2. GET LIVE STATS
exports.getPlatformStats = async (req, res) => {
  try {
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalStudents = await User.countDocuments({ role: 'student' });

    // 1. Calculate Lesson Commission Revenue (15%)
    const connections = await Connection.find({ isPaid: true });
    const commissionRevenue = connections.reduce((acc, curr) => acc + (curr.pricing?.platformCommission || 0), 0);

    // 2. Calculate Subscription Revenue ($5 and $10)
    // We count active teachers on each plan
    const basicCount = await User.countDocuments({ 'subscription.plan': 'basic', 'subscription.status': 'active' });
    const proCount = await User.countDocuments({ 'subscription.plan': 'pro', 'subscription.status': 'active' });
    
    const subscriptionRevenue = (basicCount * 5) + (proCount * 10);

    res.json({
      totalTeachers,
      totalStudents,
      commissionRevenue: commissionRevenue.toFixed(2),
      subscriptionRevenue: subscriptionRevenue.toFixed(2),
      totalRevenue: (commissionRevenue + subscriptionRevenue).toFixed(2),
      activeSubscriptions: basicCount + proCount
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};