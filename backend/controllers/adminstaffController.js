import db from "../config/db.js";
import bcrypt from "bcryptjs";

/* ================= CREATE STAFF ================= */
export const createStaff = async (req, res) => {
  const { adminId, username, email, phone, role, department, year } = req.body;

  if (!adminId || !username || !email || !role)
    return res.status(400).json({ message: "Missing fields" });

  // Coordinator must have year
  if (role === "COORDINATOR" && ![1, 2, 3, 4].includes(year)) {
    return res.status(400).json({ message: "Coordinator year must be between 1 and 4" });
  }

  const conn = await db.getConnection();
  try {
    const [[admin]] = await conn.query(
      "SELECT role FROM users WHERE id=? AND is_active=1",
      [adminId]
    );
    if (!admin || admin.role !== "ADMIN")
      return res.status(403).json({ message: "Access denied" });

    await conn.beginTransaction();

    const [[existingUser]] = await conn.query(
      "SELECT id FROM users WHERE email=? OR phone=?",
      [email, phone]
    );
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    let deptId = null;
    if (department) {
      const [[dept]] = await conn.query(
        "SELECT id FROM departments WHERE name=?",
        [department]
      );
      if (!dept) throw new Error("Invalid department");
      deptId = dept.id;
    }

    const hash = await bcrypt.hash("Welcome@123", 10);

    const [user] = await conn.query(
      `INSERT INTO users (username,email,phone,password_hash,role,is_active)
       VALUES (?,?,?,?,?,1)`,
      [username, email, phone, hash, role]
    );

    // Role-specific inserts
    if (role === "COORDINATOR" && deptId) {
      await conn.query(
        `INSERT INTO coordinators (user_id, department_id, year)
         VALUES (?, ?, ?)`,
        [user.insertId, deptId, year]
      );
    }

    if (role === "HOD" && deptId) {
      await conn.query(
        `INSERT INTO hods (user_id, department_id)
         VALUES (?, ?)`,
        [user.insertId, deptId]
      );
    }

    if (role === "COUNSELLOR" && deptId) {
      await conn.query(
        `INSERT INTO counsellors (user_id, department_id)
         VALUES (?, ?)`,
        [user.insertId, deptId]
      );
    }

    await conn.commit();
    res.status(201).json({ message: "Staff created successfully" });

  } catch (err) {
    await conn.rollback();

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Coordinator already assigned for this department and year"
      });
    }

    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};



/* ================= GET STAFFS ================= */
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
        d.name AS department,
        d.id AS department_id,
        co.year AS coordinator_year
      FROM users u
      LEFT JOIN counsellors c ON u.id = c.user_id
      LEFT JOIN coordinators co ON u.id = co.user_id
      LEFT JOIN hods h ON u.id = h.user_id
      LEFT JOIN departments d 
        ON d.id = COALESCE(c.department_id, co.department_id, h.department_id)
      WHERE u.role <> 'STUDENT'
      ORDER BY u.role, u.username
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch staff list" });
  }
};


/* ================= DELETE STAFF ================= */
export const deleteStaff = async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.query;

  const conn = await db.getConnection();
  try {
    const [[admin]] = await conn.query(
      "SELECT role FROM users WHERE id=? AND is_active=1",
      [adminId]
    );
    if (!admin || admin.role !== "ADMIN")
      return res.status(403).json({ message: "Access denied" });

    await conn.beginTransaction();

    // Delete from all role tables
    await conn.query("DELETE FROM counsellors WHERE user_id=?", [id]);
    await conn.query("DELETE FROM coordinators WHERE user_id=?", [id]);
    await conn.query("DELETE FROM hods WHERE user_id=?", [id]);

    // Delete from users table
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
  const { adminId, username, email, phone, role, department, year } = req.body;

  if (role === "COORDINATOR" && ![1, 2, 3, 4].includes(year)) {
    return res.status(400).json({ message: "Invalid coordinator year" });
  }

  const conn = await db.getConnection();
  try {
    const [[admin]] = await conn.query(
      "SELECT role FROM users WHERE id=? AND is_active=1",
      [adminId]
    );
    if (!admin || admin.role !== "ADMIN")
      return res.status(403).json({ message: "Access denied" });

    await conn.beginTransaction();

    const [[dup]] = await conn.query(
      "SELECT id FROM users WHERE (email=? OR phone=?) AND id<>?",
      [email, phone, staffId]
    );
    if (dup)
      return res.status(409).json({ message: "Duplicate email or phone" });

    let deptId = null;
    if (department) {
      const [[dept]] = await conn.query(
        "SELECT id FROM departments WHERE name=?",
        [department]
      );
      if (!dept) throw new Error("Invalid department");
      deptId = dept.id;
    }

    await conn.query(
      "UPDATE users SET username=?, email=?, phone=?, role=? WHERE id=?",
      [username, email, phone, role, staffId]
    );

    // Remove from all role tables
    await conn.query("DELETE FROM coordinators WHERE user_id=?", [staffId]);
    await conn.query("DELETE FROM hods WHERE user_id=?", [staffId]);
    await conn.query("DELETE FROM counsellors WHERE user_id=?", [staffId]);

    // Reinsert based on role
    if (role === "COORDINATOR" && deptId) {
      await conn.query(
        `INSERT INTO coordinators (user_id, department_id, year)
         VALUES (?, ?, ?)`,
        [staffId, deptId, year]
      );
    }

    if (role === "HOD" && deptId) {
      await conn.query(
        `INSERT INTO hods (user_id, department_id)
         VALUES (?, ?)`,
        [staffId, deptId]
      );
    }

    if (role === "COUNSELLOR" && deptId) {
      await conn.query(
        `INSERT INTO counsellors (user_id, department_id)
         VALUES (?, ?)`,
        [staffId, deptId]
      );
    }

    await conn.commit();
    res.json({ message: "Staff updated successfully" });

  } catch (err) {
    await conn.rollback();

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Coordinator already exists for this department and year"
      });
    }

    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};


