import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import aiRoutes from "./routes/ai.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("✅ GRIET INTELLIGENT CAMPUS Backend Running");
});

// AI Routes
app.use("/api/ai", aiRoutes);

// Authentication Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 GRIET Intelligent Campus Backend running on port ${PORT}`);
});