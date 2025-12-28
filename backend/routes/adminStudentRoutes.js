import express from "express";
import {
  getDepartments,
  getCounsellorsByDepartment,
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/adminStudentController.js";

const router = express.Router();

router.get("/departments", getDepartments);
router.get("/counsellors/:deptId", getCounsellorsByDepartment);

router.get("/students", getAllStudents);
router.post("/students", createStudent);
router.put("/students/:studentId", updateStudent);
router.delete("/students/:studentId", deleteStudent);

export default router;
