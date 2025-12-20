import { findUserByRegisterNumber } from "../models/User.js";
import { comparePassword } from "../utils/hash.js";

export const login = async (req, res) => {
  try {
    const { registerNumber, password } = req.body;

    // 1. Validate input
    if (!registerNumber || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 2. Find user
    const [rows] = await findUserByRegisterNumber(registerNumber);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    // 3. Compare password
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. First login check
    if (user.is_first_login) {
      return res.status(200).json({
        firstLogin: true,
        role: user.role,
        message: "First login - reset password required"
      });
    }

    // 5. Normal login success
    res.status(200).json({
      message: "Login successful",
      role: user.role,
      username: user.username
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
