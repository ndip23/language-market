const { login, createPaymentLink } = require('../services/accountPeService');
const User = require('../models/User');
const Connection = require('../models/Connection');

// 1. TEACHER SUBSCRIPTION ($5 or $10)
exports.subscribeTeacher = async (req, res) => {
  const { plan } = req.body; // 'basic' or 'pro'
  const amount = plan === 'pro' ? 10 : 5;

  try {
    const token = await login();
    
    const payload = {
      amount: amount,
      currency: "USD",
      customer_email: req.user.email,
      customer_name: req.user.name,
      // Metadata encoded in the remark so we can process it later
      remark: `TYPE:SUB|PLAN:${plan}|USERID:${req.user.id}`,
      redirect_url: `${process.env.CLIENT_URL}/dashboard/teacher`
    };

    const linkData = await createPaymentLink(token, payload);
    res.json({ paymentUrl: linkData.data.link });
  } catch (err) {
    res.status(500).json({ msg: "AccountPe subscription failed" });
  }
};

// 2. STUDENT LESSON PAYMENT (15% Commission Logic)
exports.payForLesson = async (req, res) => {
  const { connectionId } = req.body;

  try {
    const connection = await Connection.findById(connectionId).populate('teacher');
    const amount = connection.teacher.teacherProfile.pricePerLesson;
    
    const token = await login();

    const payload = {
      amount: amount,
      currency: "USD",
      customer_email: req.user.email,
      customer_name: req.user.name,
      remark: `TYPE:LESSON|CONNID:${connectionId}|GROSS:${amount}`,
      redirect_url: `${process.env.CLIENT_URL}/dashboard/student/lessons`
    };

    const linkData = await createPaymentLink(token, payload);
    res.json({ paymentUrl: linkData.data.link });
  } catch (err) {
    res.status(500).json({ msg: "AccountPe lesson payment failed" });
  }
};