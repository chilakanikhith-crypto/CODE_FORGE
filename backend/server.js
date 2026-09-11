import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import aiRoutes from "./routes/ai.js";
import authRoutes from "./routes/auth.js";
import complaintRoutes from "./routes/complaints.js";
import facultyRoutes from "./routes/faculty.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", message: "GRIET Intelligent Campus API Running" });
});

// AI Routes
app.use("/api/ai", aiRoutes);

// Authentication Routes
app.use("/api/auth", authRoutes);

// Complaints & Faculty Routes
app.use("/api/complaints", complaintRoutes);
app.use("/api/faculty", facultyRoutes);

// Static frontend serving in production
const distPath = path.join(__dirname, "../dist");
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));

    // Express 5 compatible SPA fallback
    app.use((req, res) => {
        if (req.path.startsWith("/api")) {
            return res.status(404).json({ error: "API route not found" });
        }
        res.sendFile(path.join(distPath, "index.html"));
    });
} else {
    app.get("/", (_req, res) => {
        res.send("✅ GRIET INTELLIGENT CAMPUS Backend Running");
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 GRIET Intelligent Campus Backend running on port ${PORT}`);
});