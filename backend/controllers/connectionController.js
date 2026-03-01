const Connection = require('../models/Connection');
const User = require('../models/User');
const LogicService = require('../services/LogicService');

exports.requestTeacher = async (req, res) => {
  const { teacherId } = req.body;
  const studentId = req.user.id;

  const canAccept = await LogicService.canAcceptNewStudent(teacherId);
  if (!canAccept) {
    return res.status(403).json({ msg: "Teacher has reached their monthly student limit." });
  }

  const connection = await Connection.create({
    student: studentId,
    teacher: teacherId,
    status: 'pending'
  });

  // Increment the teacher's student counter
  await User.findByIdAndUpdate(teacherId, { $inc: { 'subscription.currentConnections': 1 } });

  res.status(201).json(connection);
};