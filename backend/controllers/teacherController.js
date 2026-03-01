const User = require('../models/User');

// @desc    Get all active, approved teachers with filters
// @route   GET /api/teachers
exports.getTeachers = async (req, res) => {
  try {
    const { language, maxPrice, minRating } = req.query;

    // Base query: Must be a teacher, must be approved
    let query = { 
        role: 'teacher', 
        'teacherProfile.isApproved': true,
        // Optional: Only show teachers who have an active subscription
        // 'teacherProfile.subscriptionPlan': { $ne: 'none' } 
    };

    // Filter by Language (English or French)
    if (language) {
      query['teacherProfile.language'] = language;
    }

    // Filter by Price (Less than or equal to maxPrice)
    if (maxPrice) {
      query['teacherProfile.pricePerLesson'] = { $lte: Number(maxPrice) };
    }

    // Filter by Rating
    if (minRating) {
      query['teacherProfile.rating'] = { $gte: Number(minRating) };
    }

    // Fetch teachers from database, excluding their passwords
    const teachers = await User.find(query).select('-password');

    res.status(200).json(teachers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single teacher profile by ID
// @route   GET /api/teachers/:id
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id).select('-password');

    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ msg: 'Teacher not found' });
    }

    res.status(200).json(teacher);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Teacher not found' });
    }
    res.status(500).send('Server Error');
  }
};
exports.searchTeachers = async (req, res) => {
  try {
    const { language, minPrice, maxPrice, minRating } = req.query;

    let query = { 
      role: 'teacher', 
      'teacherProfile.isApproved': true 
    };

    if (language) query['teacherProfile.language'] = language;
    
    // Price Filter
    if (minPrice || maxPrice) {
      query['teacherProfile.pricePerLesson'] = {};
      if (minPrice) query['teacherProfile.pricePerLesson'].$gte = Number(minPrice);
      if (maxPrice) query['teacherProfile.pricePerLesson'].$lte = Number(maxPrice);
    }

    // Rating Filter
    if (minRating) {
      query['teacherProfile.rating'] = { $gte: Number(minRating) };
    }

    // Sorting: Best rated and most recently active first
    const teachers = await User.find(query)
      .select('-password')
      .sort({ 'teacherProfile.rating': -1, updatedAt: -1 });

    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ msg: "Search failed" });
  }
};