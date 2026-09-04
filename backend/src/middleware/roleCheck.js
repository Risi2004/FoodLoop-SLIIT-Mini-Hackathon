exports.verifyDonor = (req, res, next) => {
  if (req.user.role !== 'donor') {
    return res.status(403).json({ error: 'Access denied: donors only' });
  }
  next();
};

exports.verifyReceiver = (req, res, next) => {
  if (req.user.role !== 'receiver') {
    return res.status(403).json({ error: 'Access denied: receivers only' });
  }
  next();
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: admin only' });
  }
  next();
};