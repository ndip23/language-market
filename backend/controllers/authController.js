const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new Student or Teacher
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, language, pricePerLesson } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role
    };

    // If teacher, add teacher profile data
    if (role === 'teacher') {
      newUser.teacherProfile = {
        language,
        pricePerLesson,
        paymentPreference: 'platform' // Default, can be updated later
      };
    }

    user = new User(newUser);
    await user.save();

    // Create JWT Token
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user.id, name: user.name, role: user.role } });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// @desc    Update current user details
// @route   PUT /api/auth/update-me
exports.updateMe = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Find user and update
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    // Return the updated user (excluding password)
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};