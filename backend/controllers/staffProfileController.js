import db from "../config/db.js";

/* ================= GET STAFF PROFILE ================= */
export const getStaffProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    // 1️⃣ Get base user
    const [users] = await db.query(
      `SELECT id, username, role, email, phone, personal_email, photo
       FROM users
       WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    if (user.role === "STUDENT") {
      return res
        .status(403)
        .json({ message: "Students cannot access staff profile" });
    }

    let department = null;
    let designation = null;

    // 2️⃣ Role-based department & designation fetch
    if (user.role === "HOD") {
      const [rows] = await db.query(
        `SELECT d.name, h.designation
         FROM hods h
         JOIN departments d ON h.department_id = d.id
         WHERE h.user_id = ?`,
        [userId]
      );
      department = rows[0]?.name || null;
      designation = rows[0]?.designation || null;
    }

    if (user.role === "COORDINATOR") {
      const [rows] = await db.query(
        `SELECT d.name, c.designation
         FROM coordinators c
         JOIN departments d ON c.department_id = d.id
         WHERE c.user_id = ?`,
        [userId]
      );
      department = rows[0]?.name || null;
      designation = rows[0]?.designation || null;
    }

    if (user.role === "COUNSELLOR") {
      const [rows] = await db.query(
        `SELECT d.name, c.designation
         FROM counsellors c
         JOIN departments d ON c.department_id = d.id
         WHERE c.user_id = ?`,
        [userId]
      );
      department = rows[0]?.name || null;
      designation = rows[0]?.designation || null;
    }

    // 3️⃣ Final response
    res.status(200).json({
      profile: {
        ...user,
        department,
        designation,
      },
    });
  } catch (error) {
    console.error("Get Staff Profile Error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* ================= UPDATE STAFF PROFILE ================= */
export const updateStaffProfile = async (req, res) => {
  const { userId } = req.params;
  const { username, email, phone, personal_email, designation } = req.body;

  try {
    // 1️⃣ Check user role
    const [users] = await db.query(
      `SELECT role FROM users WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const role = users[0].role;
    if (role === "STUDENT") {
      return res.status(403).json({
        message: "Students cannot update staff profile",
      });
    }

    // 2️⃣ Update users table
    await db.query(
      `UPDATE users SET
        username = ?,
        email = ?,
        phone = ?,
        personal_email = ?
       WHERE id = ?`,
      [username, email, phone, personal_email, userId]
    );

    // 3️⃣ Update role-specific designation
    if (role === "HOD") {
      await db.query(
        `UPDATE hods SET designation = ? WHERE user_id = ?`,
        [designation, userId]
      );
    } else if (role === "COORDINATOR") {
      await db.query(
        `UPDATE coordinators SET designation = ? WHERE user_id = ?`,
        [designation, userId]
      );
    } else if (role === "COUNSELLOR") {
      await db.query(
        `UPDATE counsellors SET designation = ? WHERE user_id = ?`,
        [designation, userId]
      );
    }

    res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update Staff Profile Error:", error);
    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};
