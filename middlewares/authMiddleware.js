// todo: Implement authentication middleware
module.exports.authMiddleware = (req, res, next) => {
  // if (!req.user) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  const tempUser = {
    id: 1,
    email: "catayasericjay@gmail.com",
  };
  req.user = tempUser; // Replace with actual user data from your authentication system

  next();
};
