const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const secret = "my fancy shmancy secret";

  if (authorization) {
    jwt.verify(authorization, secret, function(err, decodedToken) {
      if (err) {
        res.status(401).json({ message: "Invalid token" });
      } else {
        req.token = decodedToken;
        next();
      }
    });
  } else {
    res.status(400).json({ message: "Authorization required" });
  }
};
