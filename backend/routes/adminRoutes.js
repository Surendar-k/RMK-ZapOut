import express from "express";
import { createStaff, getStaffs, deleteStaff, updateStaff } from "../controllers/adminstaffController.js";

const router = express.Router();

router.post("/admin/staff", createStaff);
router.get("/admin/staff", getStaffs);
router.delete("/admin/staff/:id", deleteStaff);
router.put("/admin/staff/:id", updateStaff);

export default router;
