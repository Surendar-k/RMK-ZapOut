import express from "express";
import multer from "multer";
import { getStudentProfile, applyOnDuty } from "../controllers/onDutycontroller.js";

const router = express.Router();

// Multer setup
const upload = multer({ dest: "uploads/" });

// Get student profile
router.get("/profile/:userId", getStudentProfile);

// Apply On-Duty with single file upload
router.post("/apply", upload.single("proofFile"), applyOnDuty);

export default router;
