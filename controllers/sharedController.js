const jwt = require('jsonwebtoken');
const config = require('../config').JWT_SECRET;

//checks for token. Returns unauthorized if no token provided
exports.checkForToken = (req, res, next) => {
  const token = req.headers.authorization || req.body.token || req.body.authToken;
  if (!token) {
    res.status(401).json({
      message: "unauthorized"
    });
    return;
  }
  jwt.verify(token, config, (error, decode) => {
    if (error) {
      res.status(500).json({
        message: "Token is not valid",
        error: error
      });
      return;
    }
    req.user = decode;
    next();
  });
}