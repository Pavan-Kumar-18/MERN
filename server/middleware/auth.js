const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token'); // Retrieve token from headers
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Verify token with secret
    req.user = decoded.user; // Attach user information to request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' }); // Token is invalid
  }
};
