import express from "express";
import multer from "multer";
import {
  applyOnDuty,
  
  getStudentProfile, // ✅ Import this
} from "../controllers/onDutycontroller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Apply On-Duty
router.post("/apply", upload.single("proofFile"), applyOnDuty);



// ✅ Get student profile
router.get("/profile/:userId", getStudentProfile);

export default router;
