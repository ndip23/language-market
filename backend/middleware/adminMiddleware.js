module.exports = function(req, res, next) {
  // We already have req.user from the authMiddleware
  if (req.user && req.user.role === 'admin') {
    next(); // User is admin, let them pass
  } else {
    res.status(403).json({ msg: 'Access denied: Admin privileges required' });
  }
};