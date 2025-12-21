import express from "express";
import { checkEmail, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/check-email", checkEmail);
router.post("/login", login);

export default router;
