import express from "express";
import multer from "multer";
import {
  getStudentProfile,
  applyOnDuty,
  getOnDutyRequests,
  getOnDutyRequest,
  updateOnDutyRequest,
  cancelOnDutyRequestController
} from "../controllers/onDutycontroller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Student profile
router.get("/profile/:userId", getStudentProfile);

// Apply On-Duty
router.post("/apply", upload.single("proofFile"), applyOnDuty);

// Get all requests
router.get("/requests/:userId", getOnDutyRequests);

// Get single request
router.get("/request/:requestId", getOnDutyRequest);

// Update request (before Counsellor approval)
router.put("/request/:requestId", upload.single("proofFile"), updateOnDutyRequest);

// Cancel request (only pending)
router.delete("/cancel/:requestId", cancelOnDutyRequestController);

export default router;
