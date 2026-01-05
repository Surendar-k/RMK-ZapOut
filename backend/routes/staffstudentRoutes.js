import express from "express";
import {
  getDepartmentStudents,
  getMyStudents,
  assignStudent,
  unassignStudent,
} from "../controllers/staffStudentController.js";

const router = express.Router();

// Department students
router.get("/students/department", getDepartmentStudents);

// My counselling students
router.get("/students/my", getMyStudents);

// Assign student
router.post("/students/:id/assign", assignStudent);

// Unassign student
router.delete("/students/:id/unassign", unassignStudent);

export default router;
