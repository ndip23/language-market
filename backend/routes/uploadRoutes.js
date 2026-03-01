const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');
const User = require('../models/User');

// @route   POST /api/upload/profile-pic
// @desc    Upload a single profile picture
router.post('/profile-pic', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    // 1. Get the URL from Cloudinary
    const imageUrl = req.file.path;

    // 2. SAVE PERMANENTLY TO MONGODB
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: imageUrl },
      { new: true } // Returns the updated user document
    ).select('-password');

    // 3. Send the updated user back to frontend
    res.json(user); 
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});
// @route   POST /api/upload/gallery
// @desc    Upload multiple gallery images (Max 5)
router.post('/gallery', auth, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files) return res.status(400).json({ msg: 'No images uploaded' });

    const imageUrls = req.files.map(file => file.path);
    const user = await User.findById(req.user.id);
    
    if (user.role === 'teacher') {
      user.teacherProfile.gallery.push(...imageUrls);
      await user.save();
    }

    res.json({ gallery: user.teacherProfile.gallery, msg: 'Gallery updated!' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;