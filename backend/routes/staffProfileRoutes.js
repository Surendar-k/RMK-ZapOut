import express from "express";
import {
  getStaffProfile,
  updateStaffProfile,
} from "../controllers/staffProfileController.js";

const router = express.Router();

/* ================= STAFF PROFILE ================= */
router.get("/:userId", getStaffProfile);
router.put("/:userId", updateStaffProfile);

export default router;
