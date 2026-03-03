const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    // 1. Extract ALL fields including mobile and countryCode
    const { name, email, password, role, language, pricePerLesson, mobile, countryCode } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Create user object with all required fields
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      mobile,      
      countryCode, 
      subscription: {
        plan: 'none',
        studentLimit: 0,
        currentConnections: 0,
        status: 'inactive'
      }
    };

    if (role === 'teacher') {
      newUser.teacherProfile = {
        language,
        pricePerLesson,
        isApproved: false
      };
    }

    user = new User(newUser);
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // 3. Return full user object
    res.status(201).json({ 
        token, 
        user: { id: user.id, name: user.name, role: user.role, email: user.email, mobile: user.mobile, countryCode: user.countryCode } 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ✅ LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Return everything the frontend needs
    res.json({ 
        token, 
        user: { 
            id: user.id, name: user.name, role: user.role, email: user.email, 
            mobile: user.mobile, countryCode: user.countryCode, profilePicture: user.profilePicture,
            subscription: user.subscription
        } 
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// ✅ UPDATE ME
exports.updateMe = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;

    await user.save();
    res.json(user); // Returns the full updated user
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};