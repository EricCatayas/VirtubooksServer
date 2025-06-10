const authService = require("../services/authService.js");
const jwt = require("jsonwebtoken");

class AuthController {
  async generateToken(req, res) {
    const { username, email, password } = req.body;
    if ((!email && !username) || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const user = await authService.getUser({ username, email, password });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.status(200).json({
        message: "Authentication successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    } catch (error) {
      console.error("Error generating token:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getUserFromToken(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (!decoded) {
        return res.status(401).json({ error: "Invalid token" });
      }

      // Return user information
      res.status(200).json({
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new AuthController();
