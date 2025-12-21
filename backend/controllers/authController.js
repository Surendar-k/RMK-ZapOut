import bcrypt from "bcryptjs";
import db from "../config/db.js";

/**
 * STEP 1: Check Email
 */
export const checkEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await db.query(
      `SELECT id, role, is_active 
       FROM users 
       WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Email not registered" });
    }

    if (!rows[0].is_active) {
      return res.status(403).json({ message: "Account is inactive" });
    }

    res.status(200).json({
      message: "Email verified",
      role: rows[0].role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * STEP 2: Login
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      `SELECT id, username, email, password_hash, role, is_first_login
       FROM users
       WHERE email = ? AND is_active = 1`,
      [email]
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
        email: user.email,
        role: user.role,
        isFirstLogin: user.is_first_login,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
