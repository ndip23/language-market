const User = require('../models/User');
const Connection = require('../models/Connection');

// @desc    Update Teacher Profile
// @route   PUT /api/dashboard/teacher/profile
exports.updateProfile = async (req, res) => {
  try {
    // 1. Get the fields being sent from the frontend
    const { bio, pricePerLesson, language } = req.body;

    // 2. IMPORTANT: Check if the user is actually a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ msg: 'Access denied: You are not a registered teacher.' });
    }

    // 3. Find the user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // 4. Update the teacherProfile sub-document fields
    if (bio !== undefined) user.teacherProfile.bio = bio;
    if (pricePerLesson !== undefined) user.teacherProfile.pricePerLesson = pricePerLesson;
    if (language !== undefined) user.teacherProfile.language = language;

    // 5. Save and return the updated user
    await user.save();
    
    // Select everything except password to send back to frontend
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// @desc    Get user's connections (For Teacher or Student Dashboard)
// @route   GET /api/dashboard/connections
exports.getMyConnections = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      query = { student: req.user.id };
    } else if (req.user.role === 'teacher') {
      query = { teacher: req.user.id };
    } else {
       return res.status(403).json({ msg: 'Admins do not have connections' });
    }

    // Populate fills in the name/email of the connected user so the frontend can display it
    const connections = await Connection.find(query)
      .populate('student', 'name email')
      .populate('teacher', 'name email teacherProfile.pricePerLesson');

    res.json(connections);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};