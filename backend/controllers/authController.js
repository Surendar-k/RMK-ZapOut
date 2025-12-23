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

    if (rows.length === 0)
      return res.status(404).json({ message: "Email not registered" });

    if (!rows[0].is_active)
      return res.status(403).json({ message: "Account is inactive" });

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
      `SELECT id, username, email, password_hash, role, student_type, is_first_login, is_active
       FROM users
       WHERE email = ?`,
      [email]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = rows[0];

    if (!user.is_active)
      return res.status(403).json({ message: "Account is inactive" });

    // ✅ FIRST LOGIN: skip password check
    if (user.is_first_login === 1) {
      return res.status(200).json({
        message: "First login - password reset required",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          student_type: user.student_type,
          isFirstLogin: true,
        },
      });
    }

    // ✅ NORMAL LOGIN
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        student_type: user.student_type,
        isFirstLogin: false,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * STEP 3: First-time password reset
 */
export const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!newPassword)
    return res.status(400).json({ message: "Password cannot be empty" });

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const [result] = await db.query(
      `UPDATE users 
       SET password_hash = ?, is_first_login = 0 
       WHERE email = ? AND is_active = 1`,
      [hashedPassword, email]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found or inactive" });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
