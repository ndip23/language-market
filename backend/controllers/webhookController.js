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

  if (status !== 'success' && status !== 'completed') {
    return res.status(200).send("OK");
  }

  try {

    // SECURITY VERIFICATION
    const apiToken = await login();
    const verification = await getPaymentStatus(apiToken, transaction_id);

    if (verification?.data?.status !== 'success' && verification?.data?.status !== 'completed') {
        console.error("🚨 FRAUD ATTEMPT DETECTED:", transaction_id);
        return res.status(403).send("Transaction verification failed");
    }

    // PARSE REMARK
    const parts = remark.split('|');
    const type = parts[0];

    // ==========================================
    // CASE A: TEACHER SUBSCRIPTION
    // ==========================================
    if (type === 'SUB') {

      const plan = parts[1];
      const userId = parts[2];
      const limit = plan === 'pro' ? 20 : 6;

      await User.findByIdAndUpdate(userId, {

        'subscription.plan': plan,
        'subscription.studentLimit': limit,
        'subscription.currentConnections': 0,
        'subscription.status': 'active',

        // ✅ ADDED subscription timestamp
        'subscription.subscribedAt': new Date(),

        'subscription.activeUntil': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

      });

      console.log(`✅ Subscription Activated: ${plan} for User ${userId}`);
    }

    // ==========================================
    // CASE B: LESSON PAYMENT
    // ==========================================
    if (type === 'LESSON') {

      const connectionId = parts[1];
      const grossAmount = Number(parts[2]);

      const commission = grossAmount * 0.15;
      const netEarnings = grossAmount - commission;

      const connection = await Connection.findByIdAndUpdate(connectionId, {

        isPaid: true,

        // ✅ ADDED lesson payment timestamp
        paidAt: new Date(),

        status: 'accepted',

        'pricing.grossAmount': grossAmount,
        'pricing.platformCommission': commission,
        'pricing.teacherEarnings': netEarnings

      });

      if (connection) {

        await User.findByIdAndUpdate(connection.teacher, {
          $inc: { balance: netEarnings }
        });

        console.log(`✅ Lesson Split: Platform +${commission}, Teacher Wallet +${netEarnings}`);
      }
    }

  } catch (err) {

    console.error("WEBHOOK PROCESSING ERROR:", err.message);

  }

  res.status(200).send("OK");
};