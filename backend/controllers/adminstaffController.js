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

    let deptId = null;
    if (department) {
      const [[dept]] = await conn.query(
        "SELECT id FROM departments WHERE name=?",
        [department]
      );
      if (!dept) throw new Error("Invalid department");
      deptId = dept.id;
    }

    // 🔐 Check existing HOD / Coordinator
    if (["HOD", "COORDINATOR"].includes(role) && deptId) {
      const table = role === "HOD" ? "hods" : "coordinators";
      const [[exists]] = await conn.query(
        `SELECT id FROM ${table} WHERE department_id=?`,
        [deptId]
      );

      if (exists) {
        return res.status(409).json({
          message: `${role} already assigned for this department`,
        });
      }
    }

    const password = "Welcome@123";
    const hash = await bcrypt.hash(password, 10);

    const [user] = await conn.query(
      `INSERT INTO users (username,email,phone,password_hash,role,is_active)
       VALUES (?,?,?,?,?,1)`,
      [username, email, phone, hash, role]
    );

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
    console.error(err);
    res.status(500).json({ message: err.message || "Create failed" });
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
    const [[admin]] = await conn.query("SELECT role FROM users WHERE id=?", [
      adminId,
    ]);
    if (!admin || admin.role !== "ADMIN")
      return res.status(403).json({ message: "Access denied" });

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
  const { adminId, username, email, phone, role, department } = req.body;

  const conn = await db.getConnection();
  try {
    const [[admin]] = await conn.query(
      "SELECT id, role FROM users WHERE id=?",
      [adminId]
    );

    if (!admin || admin.role !== "ADMIN")
      return res.status(403).json({ message: "Access denied" });

    await conn.beginTransaction();

    let deptId = null;
    if (department) {
      const [[dept]] = await conn.query(
        "SELECT id FROM departments WHERE name=?",
        [department]
      );
      if (!dept) throw new Error("Invalid department");
      deptId = dept.id;
    }

    // 🔐 Prevent duplicate HOD / Coordinator
    if (["HOD", "COORDINATOR"].includes(role) && deptId) {
      const table = role === "HOD" ? "hods" : "coordinators";

      const [[exists]] = await conn.query(
        `SELECT user_id FROM ${table} WHERE department_id=? AND user_id<>?`,
        [deptId, staffId]
      );

      if (exists) {
        return res.status(409).json({
          message: `${role} already exists for this department`,
        });
      }
    }

    await conn.query(
      "UPDATE users SET username=?, email=?, phone=?, role=? WHERE id=?",
      [username, email, phone, role, staffId]
    );

    if (["COUNSELLOR", "COORDINATOR", "HOD"].includes(role) && deptId) {
      const roleTable =
        role === "HOD"
          ? "hods"
          : role === "COORDINATOR"
          ? "coordinators"
          : "counsellors";

      await conn.query(
        `INSERT INTO ${roleTable} (user_id, department_id)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE department_id=?`,
        [staffId, deptId, deptId]
      );
    }

    await conn.commit();
    res.json({ message: "Staff updated successfully" });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: err.message || "Update failed" });
  } finally {
    conn.release();
  }
};
