function requireSiweAuth (req, res, next) {
  if (!req.session.siwe || !req.session.siwe.address) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

export default requireSiweAuth;