import db from "../config/db.js";
import bcrypt from "bcryptjs";

/* ================= CREATE STAFF ================= */
export const createStaff = async (req, res) => {
  const { adminId, username, email, phone, role, department } = req.body;

  if (!adminId || !username || !email || !role)
    return res.status(400).json({ message: "Missing fields" });

  const conn = await db.getConnection();
  try {
    const [[admin]] = await conn.query(
      "SELECT role FROM users WHERE id=? AND is_active=1",
      [adminId]
    );

    if (!admin || admin.role !== "ADMIN")
      return res.status(403).json({ message: "Access denied" });

    await conn.beginTransaction();

    // Get department ID if provided
    let deptId = null;
    if (department) {
      const [[dept]] = await conn.query(
        "SELECT id FROM departments WHERE name=?",
        [department]
      );
      if (dept) deptId = dept.id;
    }

    // Create user
    const password = "Welcome@123";
    const hash = await bcrypt.hash(password, 10);
    const [user] = await conn.query(
      `INSERT INTO users (username,email,phone,password_hash,role,is_active)
       VALUES (?,?,?,?,?,1)`,
      [username, email, phone, hash, role]
    );

    // Insert into role-specific table if required
    if (["COUNSELLOR", "COORDINATOR", "HOD"].includes(role) && deptId) {
      const roleTable =
        role === "HOD"
          ? "hods"
          : role === "COORDINATOR"
          ? "coordinators"
          : "counsellors";

      await conn.query(
        `INSERT INTO ${roleTable} (user_id, department_id) VALUES (?, ?)`,
        [user.insertId, deptId]
      );
    }

    await conn.commit();
    res.status(201).json({ message: "Staff created successfully" });
  } catch (err) {
    await conn.rollback();
    console.error("Create Staff Error:", err);
    res.status(500).json({ message: "Create failed" });
  } finally {
    conn.release();
  }
};

export const getStaffs = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.phone,
        u.role,
        u.is_active,
        d.id AS department_id,
        d.name AS department,
        d.display_name AS department_display
      FROM users u
      LEFT JOIN departments d 
        ON d.id = CASE 
          WHEN u.role = 'COUNSELLOR' THEN (SELECT department_id FROM counsellors WHERE user_id = u.id)
          WHEN u.role = 'COORDINATOR' THEN (SELECT department_id FROM coordinators WHERE user_id = u.id)
          WHEN u.role = 'HOD' THEN (SELECT department_id FROM hods WHERE user_id = u.id)
          ELSE NULL
        END
      WHERE u.role <> 'STUDENT'
      ORDER BY u.role, u.username
    `);

    res.json(rows);
  } catch (err) {
    console.error("Get Staffs Error:", err);
    res.status(500).json({ message: "Failed to fetch staff list" });
  }
};


/* ================= DELETE STAFF ================= */
export const deleteStaff = async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.query;

  const conn = await db.getConnection();
  try {
    const [[admin]] = await conn.query("SELECT role FROM users WHERE id=?", [adminId]);
    if (!admin || admin.role !== "ADMIN") return res.status(403).json({ message: "Access denied" });

    await conn.beginTransaction();

    // Delete from all role tables
    await conn.query("DELETE FROM counsellors WHERE user_id=?", [id]);
    await conn.query("DELETE FROM coordinators WHERE user_id=?", [id]);
    await conn.query("DELETE FROM hods WHERE user_id=?", [id]);

    await conn.query("DELETE FROM users WHERE id=?", [id]);
    await conn.commit();

    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    await conn.rollback();
    console.error("Delete Staff Error:", err);
    res.status(500).json({ message: "Delete failed" });
  } finally {
    conn.release();
  }
};

/* ================= UPDATE STAFF ================= */
export const updateStaff = async (req, res) => {
  const staffId = req.params.id;
  const { adminId, username, email, phone, role, department, userId } = req.body;

  const conn = await db.getConnection();
  try {
    const [[user]] = await conn.query("SELECT id, role, is_active FROM users WHERE id=?", [adminId || userId]);
    if (!user) return res.status(403).json({ message: "Access denied" });

    const roleTable =
      role === "HOD"
        ? "hods"
        : role === "COORDINATOR"
        ? "coordinators"
        : "counsellors";

    await conn.beginTransaction();

    // Only admin can update staff role and department
    if (user.role === "ADMIN") {
      if (department) {
        const [[dept]] = await conn.query("SELECT id FROM departments WHERE name=?", [department]);
        if (dept) {
          await conn.query(
            `INSERT INTO ${roleTable} (user_id, department_id) VALUES (?, ?) 
             ON DUPLICATE KEY UPDATE department_id=?`,
            [staffId, dept.id, dept.id]
          );
        }
      }

      await conn.query(
        "UPDATE users SET username=?, email=?, phone=?, role=? WHERE id=?",
        [username, email, phone, role, staffId]
      );

      await conn.commit();
      return res.json({ message: "Staff updated successfully" });
    }

    // Staff themselves can update only if active
    if (user.id === staffId && user.is_active) {
      await conn.query(
        "UPDATE users SET username=?, email=?, phone=? WHERE id=?",
        [username, email, phone, staffId]
      );
      await conn.commit();
      return res.json({ message: "Profile updated successfully" });
    }

    await conn.rollback();
    res.status(403).json({ message: "Access denied" });
  } catch (err) {
    await conn.rollback();
    console.error("Update Staff Error:", err);
    res.status(500).json({ message: "Update failed" });
  } finally {
    conn.release();
  }
};
