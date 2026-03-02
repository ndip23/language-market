const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User'); // Ensure path is correct

const seedAdmin = async () => {
  try {
    // 1. Connect to Database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('--- Connected to MongoDB for Seeding ---');

    // 2. Check if Admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('ADMIN LOG: Master Admin already exists.');
      process.exit();
    }

    // 3. Admin Details (Change these to your desired login)
    const adminEmail = "boss@langconnect.com";
    const adminPass = "LuxuryAdmin2024!"; // Strong password

    // 4. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPass, salt);

    // 5. Create Admin User
    const masterAdmin = new User({
      name: "System Director",
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      profilePicture: "https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff",
      isActive: true
    });

    await masterAdmin.save();

    console.log('-----------------------------------------');
    console.log('✅ SUCCESS: MASTER ADMIN CREATED');
    console.log(`📧 EMAIL: ${adminEmail}`);
    console.log(`🔑 PASS: ${adminPass}`);
    console.log('-----------------------------------------');

    process.exit();
  } catch (err) {
    console.error('❌ SEED ERROR:', err);
    process.exit(1);
  }
};

seedAdmin();