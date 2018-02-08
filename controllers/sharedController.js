const jwt = require('jsonwebtoken');
const config = require('../config').JWT_SECRET;

exports.checkForToken = (req, res, next) => {
  console.log(req.body.token)
  console.log(req.body.recipeTitle)
  console.log(req.file)
  const token = req.headers.authorization || req.body.token;
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