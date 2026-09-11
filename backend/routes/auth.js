import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

export const users = [];

users.push({
  id: "faculty-1",
  username: "1",
  name: "Demo Faculty",
  department: "Computer Science",
  email: "faculty1@griet.ac.in",
  passwordHash: bcrypt.hashSync("1234", 10),
  role: "faculty",
  active: true,
});

users.push({
  id: "admin",
  username: "admin",
  passwordHash: bcrypt.hashSync("admin123", 10),
  role: "admin",
});

export function getFacultyById(facultyId) {
  return users.find(
    (user) => user.role === "faculty" && user.username === String(facultyId).trim()
  );
}

export function toPublicUser(user) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
    department: user.department,
    email: user.email,
    active: user.active,
  };
}

export function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization && authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ success: false, message: "JWT_SECRET is not configured" });
  }

  try {
    req.user = jwt.verify(token, secret);
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired authentication token" });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ success: false, message: `${role} access required` });
    }
    return next();
  };
}

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

    const user = users.find((item) => item.username === String(username).trim());

    // User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    if (user.role === "faculty" && !user.active) {
      return res.status(403).json({
        success: false,
        message: "This faculty account is inactive. Contact an administrator.",
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
        ...toPublicUser(user),
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