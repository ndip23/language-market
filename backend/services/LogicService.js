const User = require('../models/User');

class LogicService {
  // Enforce the $5 (6 students) or $10 (20 students) limit
  static async canAcceptStudent(teacherId) {
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.subscription.status !== 'active') return false;
    
    // Check if limit reached
    if (teacher.subscription.currentConnections >= teacher.subscription.studentLimit) {
      return false;
    }
    return true;
  }

  // Calculate 15% Platform Commission
  static calculatePayout(amount, preference) {
    if (preference === 'external') {
      return { gross: amount, commission: 0, net: amount };
    }
    const commission = amount * 0.15;
    const net = amount - commission;
    return { gross: amount, commission, net };
  }
}

module.exports = LogicService;