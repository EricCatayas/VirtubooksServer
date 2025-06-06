const jwt = require("jsonwebtoken");

// todo: Implement authentication middleware
module.exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    console.log("User authenticated:", req.user, token);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
