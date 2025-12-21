import express from "express";
import { checkRegisterNumber, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/check-register", checkRegisterNumber);
router.post("/login", login);

export default router;
