import express from "express";
import { getStudentHistory } from "../controllers/historyController.js";

const router = express.Router();

// GET /api/history/:userId
router.get("/:userId", getStudentHistory);

export default router;
