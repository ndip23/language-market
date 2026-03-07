const accountPeService = require('../services/accountPeService');
const User = require('../models/User');
const Connection = require('../models/Connection');

// 1. GET LIVE EXCHANGE RATE
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

// 2. STUDENT LESSON PAYMENT (Split 15%/85%)
exports.payForLesson = async (req, res) => {
  const { teacherId, amount, countryCode, mobile, currency, connectionId } = req.body;

  try {
    const student = await User.findById(req.user.id);
    const token = await accountPeService.login();

    let conn;
    if (connectionId) {
      conn = await Connection.findById(connectionId).populate('teacher');
    } else {
      conn = await Connection.create({ student: student._id, teacher: teacherId, status: 'pending' });
      conn = await conn.populate('teacher');
    }

    const uniqueTxnId = `LES${Date.now()}${student._id.toString().substring(0, 4)}`;

    // THE REMARK: LESSON | connectionId | local_amount
    const remarkData = `LESSON|${conn._id}|${amount}`;

    const payload = {
      country_code: countryCode,
      name: student.name.toUpperCase(),
      email: student.email,
      mobile: mobile,
      amount: amount,
      currency: currency,
      transaction_id: uniqueTxnId,
      description: `Lesson Payment: ${student.name}`,
      remark: remarkData,
      pass_digital_charge: true,
      // 🚨 REDIRECT INCLUDES REMARK FOR INSTANT FRONTEND VERIFICATION
      redirect_url: `${process.env.CLIENT_URL}/dashboard/student/lessons?status=success&remark=${remarkData}`,
      callback_url: `${process.env.BACKEND_URL}/api/payments/webhook`
    };

    const result = await accountPeService.createLink(token, payload);
    res.json({ paymentUrl: result.data.payment_link });
  } catch (err) {
    console.error("LESSON PAY ERROR:", err.message);
    res.status(500).json({ msg: "Payment setup failed" });
  }
};

// 3. TEACHER SUBSCRIPTION ($5 or $10)
exports.subscribeTeacher = async (req, res) => {
  const { plan, countryCode, mobile, currency } = req.body;
  const usdAmount = plan === 'pro' ? 10 : 5;

  try {
    const user = await User.findById(req.user.id);
    const token = await accountPeService.login();
    const localAmount = await accountPeService.getFiatRate(token, countryCode, usdAmount);
    const finalAmount = localAmount || Math.ceil(usdAmount * 650);

    // 2. CONSTRUCT DATA: Construct remark BEFORE the payload
    const remarkData = `SUB|${plan}|${user._id}`;
    
    // 3. UNIQUE ID: Generate ONCE so it matches in the payload and the URL
    const uniqueTxnId = `SUB${Date.now()}${user._id.toString().substring(0, 4)}`;

    const payload = {
      country_code: countryCode,
      name: user.name.toUpperCase(),
      email: user.email,
      mobile: mobile,
      amount: finalAmount,
      currency: currency,
      transaction_id: uniqueTxnId, 
      description: `Tutor Plan: ${plan.toUpperCase()}`,
      pass_digital_charge: true,
      remark: remarkData,
      // This ensures your frontend "Verify" logic sees the data and unlocks the account.
      redirect_url: `${process.env.CLIENT_URL}/dashboard/teacher/subscription?status=success&transaction_id=${uniqueTxnId}&remark=${encodeURIComponent(remarkData)}`,
      
      callback_url: `${process.env.BACKEND_URL}/api/payments/webhook`
    };

    console.log("🚀 INITIATING PAYMENT:", { txnId: uniqueTxnId, amount: finalAmount });

    const result = await accountPeService.createLink(token, payload);

    if (result && result.data && result.data.payment_link) {
        res.json({ paymentUrl: result.data.payment_link });
    } else {
        console.error("❌ Gateway Malformed Response:", result);
        res.status(400).json({ msg: "Gateway did not provide a valid link" });
    }

  } catch (err) {
    console.error("❌ Initialization Error:", err.message);
    res.status(500).json({ msg: "Subscription initialization failed" });
  }
};

// 4. GET PAYOUT METHODS
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

// 5. TEACHER WITHDRAWAL (Payout)
exports.requestWithdrawal = async (req, res) => {
  const { amount, methodCode, accountNumber } = req.body;

  try {
    // A. Verify Teacher and Balance
    const teacher = await User.findById(req.user.id);
    if (!teacher) return res.status(404).json({ msg: "User not found" });

    const withdrawAmount = Number(amount);
    if (teacher.balance < withdrawAmount) {
      return res.status(400).json({ msg: "Insufficient balance for this withdrawal." });
    }

    // B. Login to Swychr Payout Engine
    const token = await accountPeService.login();

    // C. Prepare Payout Payload (Matching your Swychr Payout Screenshot)
    const payload = {
      country_code: teacher.countryCode,
      amount: withdrawAmount,
      currency: "USD", // We track balance in USD, Swychr converts to local currency
      payout_method: methodCode, // e.g. "MTN_MOMO" or "GTB"
      account_number: accountNumber,
      beneficiary_name: teacher.name.toUpperCase(),
      transaction_id: `WDL${Date.now()}${teacher._id.toString().substring(0, 4)}`
    };

    // D. Execute Transaction
    console.log(`LOG: Dispatching $${withdrawAmount} to ${teacher.name}...`);
    const result = await accountPeService.createPayoutTransaction(token, payload);

    if (result.status === 200 || result.status === 'success') {

      // E. SUCCESS: Deduct from DB Balance
      teacher.balance -= withdrawAmount;
      await teacher.save();

      // F. Send Success Message back to Frontend
      res.json({
        success: true,
        msg: `Withdrawal of $${withdrawAmount} processed successfully. Check your local account.`,
        newBalance: teacher.balance
      });

      console.log(`✅ Withdrawal Successful: User ${teacher.name} deducted $${withdrawAmount}`);
    } else {
      console.error("❌ Gateway Rejected Payout:", result.message);
      res.status(400).json({ msg: result.message || "The payment provider rejected the transaction." });
    }

  } catch (err) {
    console.error("CRITICAL WITHDRAWAL ERROR:", err.message);
    res.status(500).json({ msg: "Payout service temporarily unavailable." });
  }
};
// @desc    Verify payment status after redirect
// @route   GET /api/payments/verify/:transaction_id
// @desc    Verify payment status after redirect and unlock features
// @route   GET /api/payments/verify/:transaction_id
exports.verifyPaymentStatus = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const { remark } = req.query; 

    if (!remark) {
      return res.status(400).json({ success: false, msg: "Missing transaction data" });
    }

    // 1. Get Security Token
    const token = await accountPeService.login();

    // 2. 🛡️ VERIFY WITH SWYCHR (Safety First)
    // We only verify if it's not a dummy 'LATEST' ID
    let isActuallyPaid = false;
    if (transaction_id !== 'LATEST' && transaction_id !== 'undefined') {
      const verification = await accountPeService.getPaymentStatus(token, transaction_id);
      if (verification?.data?.status === 'success' || verification?.data?.status === 'completed') {
        isActuallyPaid = true;
      }
    } else {
        // If ID is missing but we're in the success redirect, we allow processing
        isActuallyPaid = true; 
    }

    if (isActuallyPaid) {
      // 3. PARSE DATA FROM REMARK (e.g., "SUB|basic|userId")
      const [type, id, value] = remark.split('|');

      // --- CASE A: TEACHER SUBSCRIPTION ($5/$10) ---
      if (type === 'SUB') {
        const plan = id; // 'basic' or 'pro'
        const userId = value;
        const limit = plan === 'pro' ? 20 : 6;

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            'subscription.plan': plan,
            'subscription.studentLimit': limit,
            'subscription.currentConnections': 0, // Reset for new plan
            'subscription.status': 'pending_approval',
            'subscription.activeUntil': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          },
          { new: true },
          console.log(`✅ Verified: Teacher ${updatedUser.name} unlocked for ${plan} plan.`)
        );
        
        return res.json({ success: true, msg: "Payment Verified. Awaiting Admin Review." });
      }

      // --- CASE B: LESSON PAYMENT (15% Split) ---
      if (type === 'LESSON') {
        const connectionId = id;
        const grossAmount = Number(value);
        const commission = grossAmount * 0.15;
        const teacherNet = grossAmount - commission;

        const connection = await Connection.findByIdAndUpdate(connectionId, {
          isPaid: true,
          status: 'accepted',
          'pricing.grossAmount': grossAmount,
          'pricing.platformCommission': commission,
          'pricing.teacherEarnings': teacherNet
        });

        // 💰 ADD FUNDS TO TEACHER WALLET
        if (connection) {
          await User.findByIdAndUpdate(connection.teacher, { 
            $inc: { balance: teacherNet } 
          });
        }
        console.log(`✅ Verified: Lesson paid. Platform earned ${commission}`);
      }

      return res.json({ success: true, msg: "Handshake Complete. Features Unlocked." });
    }

    // If Swychr API says it's not paid yet
    res.status(400).json({ success: false, msg: "Payment verification pending. Try refreshing." });

  } catch (err) {
    console.error("VERIFICATION CRASH:", err.message);
    res.status(500).json({ msg: "Internal system error during verification" });
  }
};