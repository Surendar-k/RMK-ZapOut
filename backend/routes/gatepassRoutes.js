import express from "express";
import { getStudentInfo, applyGatepass } from "../controllers/gatepassController.js";

const router = express.Router();

// Prefill student info
router.get("/student/:studentId", getStudentInfo);

// Submit gatepass request
router.post("/apply", applyGatepass);

export default router;
