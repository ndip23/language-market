const User = require('../models/User');

module.exports = async (req, res, next) => {
  const teacher = await User.findById(req.body.teacherId);
  
  if (!teacher || teacher.subscription.status !== 'active') {
    return res.status(403).json({ msg: "Inactive plan. This teacher cannot accept students." });
  }

  // ENFORCE $5 vs $10 LIMITS
  if (teacher.subscription.currentConnections >= teacher.subscription.studentLimit) {
    return res.status(403).json({ 
        msg: "Limit Reached. This teacher cannot accept more students this month." 
    });
  }

  next();
};