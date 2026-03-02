const accountPeService = require('../services/accountPeService');
const User = require('../models/User');
const Connection = require('../models/Connection'); // ✅ ADDED MISSING IMPORT

// 1. Get Live Rate
exports.getExchangeRate = async (req, res) => {
  try {
    const { countryCode, amount } = req.query;
    const token = await accountPeService.login();
    const localAmount = await accountPeService.getFiatRate(token, countryCode, amount);
    res.json({ localAmount: localAmount || Math.ceil(amount * 650) });
  } catch (err) {
    res.status(500).json({ msg: "Conversion error" });
  }
};

// 2. Student Lesson Payment (The 500 Error Fix)
exports.payForLesson = async (req, res) => {
  const { teacherId, amount, countryCode, mobile, currency, connectionId } = req.body;

  try {
    const student = await User.findById(req.user.id);
    const token = await accountPeService.login();

    // Identify or Create Connection
    let conn;
    if (connectionId) {
      conn = await Connection.findById(connectionId).populate('teacher');
    } else {
      conn = await Connection.create({ student: student._id, teacher: teacherId, status: 'pending' });
      conn = await conn.populate('teacher');
    }

    // 🚨 UNIQUE TXN ID (Crucial for Swychr)
    const uniqueTxnId = `LES${Date.now()}${student._id.toString().substring(0,4)}`;

    const payload = {
      country_code: countryCode,
      name: student.name.toUpperCase(),
      email: student.email,
      mobile: mobile,
      amount: amount, // The local amount calculated on the frontend
      currency: currency,
      transaction_id: uniqueTxnId,
      description: `Lesson Payment: ${student.name}`,
      remark: `LESSON|${conn._id}|${amount}`,
      pass_digital_charge: true,
      callback_url: `https://your-domain.com/api/payments/webhook`,
      redirect_url: `http://localhost:5173/dashboard/student/lessons`
    };

    const result = await accountPeService.createLink(token, payload);

    if (result && result.data && result.data.payment_link) {
      res.json({ paymentUrl: result.data.payment_link });
    } else {
      res.status(400).json({ msg: "Gateway failed to provide link" });
    }
  } catch (err) {
    console.error("LESSON PAY ERROR:", err.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// 3. Teacher Subscription
exports.subscribeTeacher = async (req, res) => {
  const { plan, countryCode, mobile, currency } = req.body;
  const usdAmount = plan === 'pro' ? 10 : 5;

  try {
    const user = await User.findById(req.user.id);
    const token = await accountPeService.login();
    const localAmount = await accountPeService.getFiatRate(token, countryCode, usdAmount);
    const finalAmount = localAmount || Math.ceil(usdAmount * 650);

    const payload = {
      country_code: countryCode,
      name: user.name.toUpperCase(),
      email: user.email,
      mobile: mobile,
      amount: finalAmount,
      currency: currency,
      transaction_id: `SUB${Date.now()}${user._id.toString().substring(0,4)}`,
      description: `Tutor Plan: ${plan.toUpperCase()}`,
      pass_digital_charge: true,
      callback_url: `https://your-api.com/api/payments/webhook`,
      redirect_url: `http://localhost:5173/dashboard/teacher/subscription`
    };

    const result = await accountPeService.createLink(token, payload);
    res.json({ paymentUrl: result.data.payment_link });
  } catch (err) {
    res.status(500).json({ msg: "Payment setup failed" });
  }
};

// 4. Get Payout Methods
exports.getMethodsByCountry = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const token = await accountPeService.login();
    const methods = await accountPeService.getSupportedMethods(token, user.countryCode);
    res.json(methods);
  } catch (err) {
    res.status(500).json({ msg: "Failed methods fetch" });
  }
};

// 5. Teacher Withdrawal
exports.requestWithdrawal = async (req, res) => {
  const { amount, methodCode, accountNumber } = req.body;
  try {
    const teacher = await User.findById(req.user.id);
    if (teacher.balance < amount) return res.status(400).json({ msg: "Insufficient balance" });
    const token = await accountPeService.login();
    const payload = {
      country_code: teacher.countryCode,
      amount: amount,
      currency: "USD",
      payout_method: methodCode, 
      account_number: accountNumber,
      beneficiary_name: teacher.name.toUpperCase(),
      transaction_id: `WDL${Date.now()}`
    };
    const result = await accountPeService.createPayout(token, payload);
    teacher.balance -= amount;
    await teacher.save();
    res.json({ msg: "Success", balance: teacher.balance });
  } catch (err) {
    res.status(500).json({ msg: "Payout failed" });
  }
};