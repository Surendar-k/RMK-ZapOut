import db from "../config/db.js";

/* ================= GET STAFF PROFILE ================= */
export const getStaffProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const [users] = await db.query(
      `SELECT id, username, role, email, phone, personal_email, photo
       FROM users WHERE id = ?`,
      [userId]
    );

    if (!users.length)
      return res.status(404).json({ message: "User not found" });

    const user = users[0];

    if (user.role === "STUDENT")
      return res.status(403).json({ message: "Students cannot access staff profile" });

    // Select role-specific table
    const table =
      user.role === "HOD"
        ? "hods"
        : user.role === "COORDINATOR"
        ? "coordinators"
        : "counsellors";

    const [rows] = await db.query(
      `SELECT r.designation, r.department_id, d.name AS department_short, d.display_name AS department
       FROM ${table} r
       LEFT JOIN departments d ON r.department_id = d.id
       WHERE r.user_id = ?`,
      [userId]
    );

    const profile = {
      ...user,
      department_id: rows[0]?.department_id || null,
      department: rows[0]?.department || "",
      department_short: rows[0]?.department_short || "",
      designation: rows[0]?.designation || "",
    };

    return res.status(200).json({ profile });
  } catch (err) {
    console.error("Get Staff Profile Error:", err);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* ================= UPDATE STAFF PROFILE ================= */
export const updateStaffProfile = async (req, res) => {
  const { userId } = req.params;
  const { username, email, phone, personal_email, designation, department_id } = req.body;

  const conn = await db.getConnection();
  try {
    const [[user]] = await conn.query(`SELECT role FROM users WHERE id=?`, [userId]);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "STUDENT")
      return res.status(403).json({ message: "Students cannot update profile" });

    await conn.beginTransaction();

    // Update users table
    await conn.query(
      `UPDATE users SET username=?, email=?, phone=?, personal_email=? WHERE id=?`,
      [username, email, phone, personal_email, userId]
    );

    const table =
      user.role === "HOD"
        ? "hods"
        : user.role === "COORDINATOR"
        ? "coordinators"
        : "counsellors";

    // Update department
    if (department_id) {
      await conn.query(
        `INSERT INTO ${table} (user_id, department_id)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE department_id=?`,
        [userId, department_id, department_id]
      );
    }

    // Update designation
    if (designation) {
      await conn.query(
        `INSERT INTO ${table} (user_id, designation)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE designation=?`,
        [userId, designation, designation]
      );
    }

    await conn.commit();

    // Fetch updated profile
    const [rows] = await conn.query(
      `SELECT r.designation, r.department_id, d.name AS department_short, d.display_name AS department
       FROM ${table} r
       LEFT JOIN departments d ON r.department_id = d.id
       WHERE r.user_id = ?`,
      [userId]
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: {
        ...user,
        department_id: rows[0]?.department_id || null,
        department: rows[0]?.department || "",
        department_short: rows[0]?.department_short || "",
        designation: rows[0]?.designation || "",
      },
    });
  } catch (err) {
    await conn.rollback();
    console.error("Update Staff Profile Error:", err);
    return res.status(500).json({ message: "Failed to update profile" });
  } finally {
    conn.release();
  }
};
