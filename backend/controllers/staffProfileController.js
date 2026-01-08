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
      return res
        .status(403)
        .json({ message: "Students cannot access staff profile" });

    /* ---------- ROLE TABLE ---------- */
    const table =
      user.role === "HOD"
        ? "hods"
        : user.role === "COORDINATOR"
        ? "coordinators"
        : "counsellors";

    /* ---------- FETCH ROLE DATA ---------- */
    const [rows] = await db.query(
      `
      SELECT 
        r.designation,
        r.department_id,
        ${user.role === "COORDINATOR" ? "r.year," : ""}
        d.name AS department_short,
        d.display_name AS department
      FROM ${table} r
      LEFT JOIN departments d ON r.department_id = d.id
      WHERE r.user_id = ?
      `,
      [userId]
    );

    const roleData = rows[0] || {};

    const profile = {
      ...user,
      department_id: roleData.department_id || null,
      department: roleData.department || "",
      department_short: roleData.department_short || "",
      designation: roleData.designation || "",
      year: user.role === "COORDINATOR" ? roleData.year || null : undefined,
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
  const {
    username,
    email,
    phone,
    personal_email,
    designation,
    department_id,
    year,
  } = req.body;

  const conn = await db.getConnection();
  try {
    const [[user]] = await conn.query(
      `SELECT role FROM users WHERE id = ?`,
      [userId]
    );

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "STUDENT")
      return res
        .status(403)
        .json({ message: "Students cannot update profile" });

    /* ---------- VALIDATION BEFORE TRANSACTION ---------- */
    if (user.role === "COORDINATOR") {
      if (!year) {
        return res
          .status(400)
          .json({ message: "Year is required for coordinator" });
      }

      // ✅ Check unique (department_id, year)
      const [exists] = await conn.query(
        `SELECT user_id FROM coordinators
         WHERE department_id = ?
           AND year = ?
           AND user_id != ?`,
        [department_id, year, userId]
      );

      if (exists.length > 0) {
        return res.status(409).json({
          message: "This year is already assigned to another coordinator",
        });
      }
    }

    await conn.beginTransaction();

    /* ---------- UPDATE USERS TABLE ---------- */
    await conn.query(
      `UPDATE users
       SET username = ?, email = ?, phone = ?, personal_email = ?
       WHERE id = ?`,
      [username, email, phone, personal_email, userId]
    );

    /* ---------- ROLE-SPECIFIC UPSERT ---------- */
    if (user.role === "COORDINATOR") {
      await conn.query(
        `INSERT INTO coordinators (user_id, department_id, designation, year)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           department_id = VALUES(department_id),
           designation = VALUES(designation),
           year = VALUES(year)`,
        [userId, department_id || null, designation || null, year]
      );
    } else {
      const table = user.role === "HOD" ? "hods" : "counsellors";

      await conn.query(
        `INSERT INTO ${table} (user_id, department_id, designation)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE
           department_id = VALUES(department_id),
           designation = VALUES(designation)`,
        [userId, department_id || null, designation || null]
      );
    }

    await conn.commit();

    /* ---------- FETCH UPDATED PROFILE ---------- */
    const table =
      user.role === "HOD"
        ? "hods"
        : user.role === "COORDINATOR"
        ? "coordinators"
        : "counsellors";

    const [rows] = await conn.query(
      `SELECT r.designation, r.department_id,
              d.name AS department_short,
              d.display_name AS department
       FROM ${table} r
       LEFT JOIN departments d ON r.department_id = d.id
       WHERE r.user_id = ?`,
      [userId]
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: {
        role: user.role,
        department_id: rows[0]?.department_id || null,
        department: rows[0]?.department || "",
        department_short: rows[0]?.department_short || "",
        designation: rows[0]?.designation || "",
        year: user.role === "COORDINATOR" ? year : undefined,
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

