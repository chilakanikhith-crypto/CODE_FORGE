import express from "express";
import { authenticateToken, getFacultyById, requireRole } from "./auth.js";

const router = express.Router();
const complaints = [
  {
    id: "FAC-2026-510521",
    facultyName: "UMA MAHESH",
    facultyId: "1",
    department: "cse",
    category: "Water",
    location: "2",
    description: "check water status",
    priority: "Medium",
    attachmentName: null,
    timestamp: "2026-09-11T06:51:50.521Z",
    status: "Submitted",
  },
];
const statuses = ["Submitted", "Acknowledged", "In Progress", "Resolved", "Rejected"];

function createComplaintId() {
  return `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
}

router.post("/", authenticateToken, requireRole("faculty"), (req, res) => {
  const {
    category,
    location,
    description,
    priority,
    attachmentName,
  } = req.body;

  const faculty = getFacultyById(req.user.username);
  if (!faculty || !faculty.active) {
    return res.status(403).json({ success: false, message: "Only active registered faculty can submit complaints" });
  }

  if (![category, location, description, priority]
    .every((value) => typeof value === "string" && value.trim())) {
    return res.status(400).json({ success: false, message: "All required complaint fields must be provided" });
  }

  const complaint = {
    id: createComplaintId(),
    facultyName: faculty.name,
    facultyId: faculty.username,
    department: faculty.department,
    category: category.trim(),
    location: location.trim(),
    description: description.trim(),
    priority: priority.trim(),
    attachmentName: attachmentName || null,
    timestamp: new Date().toISOString(),
    status: "Submitted",
  };

  complaints.unshift(complaint);
  return res.status(201).json({ success: true, complaint });
});

router.get("/", authenticateToken, requireRole("admin"), (_req, res) => {
  return res.json({ success: true, complaints });
});

router.patch("/:id/status", authenticateToken, requireRole("admin"), (req, res) => {
  const { status } = req.body;
  if (!statuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid complaint status" });
  }

  const complaint = complaints.find((item) => item.id === req.params.id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: "Complaint not found" });
  }

  complaint.status = status;
  return res.json({ success: true, complaint });
});

export default router;
