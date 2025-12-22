import express from "express";
import {
  getStudentProfile,
  updateStudentProfile,
} from "../controllers/studentProfileController.js";

const router = express.Router();

router.get("/:userId", getStudentProfile);
router.put("/:userId", updateStudentProfile);

export default router;
