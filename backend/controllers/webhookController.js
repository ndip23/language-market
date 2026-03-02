const User = require('../models/User');
const Connection = require('../models/Connection');
const { login, getPaymentStatus } = require('../services/accountPeService');

/**
 * @desc    Handle Swychr (AccountPe) Callback
 * @route   POST /api/payments/webhook
 * @access  Public (Called by Swychr Server)
 */
exports.handleSwychrWebhook = async (req, res) => {
  const { status, remark, transaction_id } = req.body;

  // 1. Initial Status Check
  if (status !== 'success' && status !== 'completed') {
    return res.status(200).send("OK"); // We acknowledge even failed ones to stop retries
  }

  try {
    // 2. 🛡️ SECURITY VERIFICATION (Anti-Hacker Shield)
    // We don't trust the POST body. We call AccountPe ourselves to verify this transaction.
    const apiToken = await login();
    const verification = await getPaymentStatus(apiToken, transaction_id);

    // Check if Swychr says this specific transaction_id is truly successful
    if (verification?.data?.status !== 'success' && verification?.data?.status !== 'completed') {
        console.error("🚨 FRAUD ATTEMPT DETECTED: Webhook status mismatch for TXN:", transaction_id);
        return res.status(403).send("Transaction verification failed");
    }

    // 3. PARSE THE REMARK DATA
    // Format sent from Frontend: "SUB|plan|userId" OR "LESSON|connectionId|amount"
    const parts = remark.split('|');
    const type = parts[0];

    // ==========================================
    // CASE A: TEACHER SUBSCRIPTION UPGRADE ($5/$10)
    // ==========================================
    if (type === 'SUB') {
      const plan = parts[1]; // 'basic' or 'pro'
      const userId = parts[2];
      const limit = plan === 'pro' ? 20 : 6;

      await User.findByIdAndUpdate(userId, {
        'subscription.plan': plan,
        'subscription.studentLimit': limit,
        'subscription.currentConnections': 0, // 🚨 RESET student count to 0
        'subscription.status': 'active',
        'subscription.activeUntil': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days
      });

      console.log(`✅ Subscription Activated: ${plan} for User ${userId}`);
    }

    // ==========================================
    // CASE B: STUDENT LESSON PAYMENT (15% Split)
    // ==========================================
    if (type === 'LESSON') {
      const connectionId = parts[1];
      const grossAmount = Number(parts[2]);

      // Calculate the platform's share and teacher's share
      const commission = grossAmount * 0.15; // 15% for the platform
      const netEarnings = grossAmount - commission; // 85% for the tutor

      // Update the Connection status
      const connection = await Connection.findByIdAndUpdate(connectionId, {
        isPaid: true,
        status: 'accepted',
        'pricing.grossAmount': grossAmount,
        'pricing.platformCommission': commission,
        'pricing.teacherEarnings': netEarnings
      });

      // 💰 IMPORTANT: Update the Teacher's Wallet Balance
      if (connection) {
        await User.findByIdAndUpdate(connection.teacher, {
          $inc: { balance: netEarnings } // Add the 85% to their withdrawable balance
        });
        console.log(`✅ Lesson Split: Platform +${commission}, Teacher Wallet +${netEarnings}`);
      }
    }

  } catch (err) {
    console.error("WEBHOOK PROCESSING ERROR:", err.message);
    // We still send 200 to Swychr so they stop sending the request, 
    // but we log the error internally.
  }

  // Always respond with 200 OK to AccountPe
  res.status(200).send("OK");
};