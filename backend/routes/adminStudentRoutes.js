import express from "express";
import {
  getDepartments,
  
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStaffByDepartment,
} from "../controllers/adminStudentController.js";

const router = express.Router();

router.get("/departments", getDepartments);
router.get("/staff/:deptId", getStaffByDepartment);

router.get("/students", getAllStudents);
router.post("/students", createStudent);
router.put("/students/:studentId", updateStudent);
router.delete("/students/:studentId", deleteStudent);

export default router;
