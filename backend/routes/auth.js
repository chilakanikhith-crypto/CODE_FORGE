import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

/*
  GRIET Intelligent Campus
  Faculty Login

  Username = Faculty S.No.
  Password = 1234

  S.No. 1 to 322
*/

// Create users 1 to 322
const users = Array.from({ length: 322 }, (_, index) => ({
  id: index + 1,
  username: String(index + 1),
  passwordHash: bcrypt.hashSync("1234", 10),
  role: "faculty",
}));

// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check empty fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Find user by S.No.
    const user = users.find(
      (item) => item.username === String(username).trim()
    );

    // User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Check password
    const validPassword = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // JWT secret
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured",
      });
    }

    // Create login token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      secret,
      {
        expiresIn: "2h",
      }
    );

    // Successful login
    return res.json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication server error",
    });
  }
});

export default router;