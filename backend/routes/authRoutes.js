import express from "express";
import {
  checkEmail,
  login,
  updatePassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/check-email", checkEmail);
router.post("/login", login);
router.put("/update-password", updatePassword);

export default router;
