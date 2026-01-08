import express from "express";
import multer from "multer";
import {
  getAllStudentRequests,
  cancelRequest,
  updateRequest,
  getStaffRequests,
  updateRequestStatus,
} from "../controllers/requestController.js";

const router = express.Router();

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

router.get("/student/:userId", getAllStudentRequests);
router.delete("/:requestId", cancelRequest);
router.put("/:requestId", upload.single("proofFile"), updateRequest);

// Get requests for logged-in staff
router.get("/staff/:staffId/:role", getStaffRequests);

// Approve or reject a request
router.put("/staff/request/:requestId/status", updateRequestStatus);

export default router;
