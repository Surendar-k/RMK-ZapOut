import bcrypt from "bcryptjs";
import db from "../config/db.js";

export const checkRegisterNumber = async (req, res) => {
  const { registerNumber } = req.body;

  try {
    const [rows] = await db.query(
      `SELECT id, role, is_active 
       FROM users 
       WHERE register_number = ?`,
      [registerNumber]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Register number not found" });
    }

    if (!rows[0].is_active) {
      return res.status(403).json({ message: "Account is inactive" });
    }

    res.status(200).json({
      message: "Register number verified",
      role: rows[0].role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { registerNumber, password } = req.body;

  try {
    const [rows] = await db.query(
      `SELECT id, username, password_hash, role, is_first_login 
       FROM users 
       WHERE register_number = ? AND is_active = 1`,
      [registerNumber]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        registerNumber,
        role: user.role,
        isFirstLogin: user.is_first_login,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
