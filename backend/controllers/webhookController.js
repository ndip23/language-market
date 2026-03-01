const User = require('../models/User');
const Connection = require('../models/Connection');

exports.handleSwychrWebhook = async (req, res) => {
  const { status, remark } = req.body;

  if (status === 'success') {
    // Parse the data we put in the remark earlier
    const data = Object.fromEntries(remark.split('|').map(s => s.split(':')));

    // CASE A: TEACHER UPGRADE
    if (data.TYPE === 'SUB') {
      const limit = data.PLAN === 'pro' ? 20 : 6;
      await User.findByIdAndUpdate(data.USERID, {
        'subscription.plan': data.PLAN,
        'subscription.studentLimit': limit,
        'subscription.currentConnections': 0, // RESET COUNT
        'subscription.status': 'active',
        'subscription.activeUntil': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
    }

    // CASE B: LESSON PAYMENT (15% PLATFORM COMMISSION)
    if (data.TYPE === 'LESSON') {
      const gross = Number(data.GROSS);
      const commission = gross * 0.15; // 15% FOR YOUR BOSS
      const net = gross - commission; // 85% FOR TEACHER

      await Connection.findByIdAndUpdate(data.CONNID, {
        isPaid: true,
        status: 'accepted',
        'payment.grossAmount': gross,
        'payment.platformCommission': commission,
        'payment.teacherNet': net
      });
    }
  }
  res.status(200).send('OK');
};