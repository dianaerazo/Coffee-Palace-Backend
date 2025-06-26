
const authMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401);
    throw new Error('No authorization token provided.');
  }
  console.log('Authentication middleware: Token check skipped for example.');
  next();
};

export default authMiddleware; // Use export default
