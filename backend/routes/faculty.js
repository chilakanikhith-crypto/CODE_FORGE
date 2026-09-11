import express from "express";
import bcrypt from "bcryptjs";
import { authenticateToken, getFacultyById, requireRole, toPublicUser, users } from "./auth.js";

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.use(authenticateToken, requireRole("admin"));

router.get("/", (_req, res) => {
  return res.json({
    success: true,
    faculty: users.filter((user) => user.role === "faculty").map(toPublicUser),
  });
});

router.post("/", async (req, res) => {
  const { name, facultyId, department, email, password, confirmPassword } = req.body;
  const values = [name, facultyId, department, email, password, confirmPassword];

  if (!values.every((value) => typeof value === "string" && value.trim())) {
    return res.status(400).json({ success: false, message: "All faculty account fields are required" });
  }
  if (!emailPattern.test(email.trim())) {
    return res.status(400).json({ success: false, message: "Enter a valid faculty email address" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match" });
  }
  if (password.length < 8) {
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
  }
  if (getFacultyById(facultyId)) {
    return res.status(409).json({ success: false, message: "Faculty ID is already registered" });
  }
  if (users.some((user) => user.email?.toLowerCase() === email.trim().toLowerCase())) {
    return res.status(409).json({ success: false, message: "Email is already registered" });
  }

  const faculty = {
    id: `faculty-${Date.now()}`,
    username: facultyId.trim(),
    name: name.trim(),
    department: department.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: await bcrypt.hash(password, 10),
    role: "faculty",
    active: true,
  };
  users.push(faculty);
  return res.status(201).json({ success: true, faculty: toPublicUser(faculty) });
});

router.patch("/:facultyId/status", (req, res) => {
  const faculty = getFacultyById(req.params.facultyId);
  if (!faculty) {
    return res.status(404).json({ success: false, message: "Faculty account not found" });
  }

  faculty.active = Boolean(req.body.active);
  return res.json({ success: true, faculty: toPublicUser(faculty) });
});

router.patch("/:facultyId/password", async (req, res) => {
  const faculty = getFacultyById(req.params.facultyId);
  const password = req.body.password;
  if (!faculty) {
    return res.status(404).json({ success: false, message: "Faculty account not found" });
  }
  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
  }

  faculty.passwordHash = await bcrypt.hash(password, 10);
  return res.json({ success: true, message: "Faculty password updated" });
});

router.delete("/:facultyId", (req, res) => {
  const index = users.findIndex(
    (user) => user.role === "faculty" && user.username === String(req.params.facultyId)
  );
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Faculty account not found" });
  }

  users.splice(index, 1);
  return res.json({ success: true });
});

export default router;
