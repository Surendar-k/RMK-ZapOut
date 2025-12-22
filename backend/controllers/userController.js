import db from "../config/db.js";

export const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT 
        id,
        username,
        register_number,
        email,
        role,
        student_type
       FROM users
       WHERE id = ? AND is_active = 1`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
