exports.verifyDonor = (req, res, next) => {
  const role = (req.user?.role || '').toUpperCase();
  if (role !== 'DONOR') {
    return res.status(403).json({ error: 'Access denied: donors only' });
  }
  next();
};

exports.verifyReceiver = (req, res, next) => {
  const role = (req.user?.role || '').toUpperCase();
  if (role !== 'RECEIVER') {
    return res.status(403).json({ error: 'Access denied: receivers only' });
  }
  next();
};

exports.verifyAdmin = (req, res, next) => {
  const role = (req.user?.role || '').toUpperCase();
  if (role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied: admin only' });
  }
  next();
};