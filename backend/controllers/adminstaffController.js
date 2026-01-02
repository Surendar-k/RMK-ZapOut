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

    // ✅ Check for existing user by email or phone
    const [[existingUser]] = await conn.query(
      "SELECT id FROM users WHERE email=? OR phone=?",
      [email, phone]
    );
    if (existingUser) {
      return res.status(409).json({ message: "User with this email or phone already exists" });
    }

    let deptId = null;
    if (department) {
      const [[dept]] = await conn.query(
        "SELECT id FROM departments WHERE name=?",
        [department]
      );
      if (!dept) throw new Error("Invalid department");
      deptId = dept.id;
    }

    const password = "Welcome@123";
    const hash = await bcrypt.hash(password, 10);

    // Insert into users table
    const [user] = await conn.query(
      `INSERT INTO users (username,email,phone,password_hash,role,is_active)
       VALUES (?,?,?,?,?,1)`,
      [username, email, phone, hash, role]
    );

    // Insert into role-specific table
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
    res.status(500).json({ message: err.message || "Create failed" });
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
        d.id AS department_id
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
  const { adminId, username, email, phone, role, department } = req.body;

  const conn = await db.getConnection();
  try {
    const [[admin]] = await conn.query(
      "SELECT id, role FROM users WHERE id=? AND is_active=1",
      [adminId]
    );
    if (!admin || admin.role !== "ADMIN")
      return res.status(403).json({ message: "Access denied" });

    await conn.beginTransaction();

    // ✅ Check for duplicate email or phone in other users
    const [[duplicateUser]] = await conn.query(
      "SELECT id FROM users WHERE (email=? OR phone=?) AND id<>?",
      [email, phone, staffId]
    );
    if (duplicateUser) {
      return res.status(409).json({ message: "Another user with this email or phone already exists" });
    }

    let deptId = null;
    if (department) {
      const [[dept]] = await conn.query(
        "SELECT id FROM departments WHERE name=?",
        [department]
      );
      if (!dept) throw new Error("Invalid department");
      deptId = dept.id;
    }

    // Update users table
    await conn.query(
      "UPDATE users SET username=?, email=?, phone=?, role=? WHERE id=?",
      [username, email, phone, role, staffId]
    );

    // Remove user from other role tables to enforce 1 role per user
    if (role === "HOD") {
      await conn.query("DELETE FROM coordinators WHERE user_id=?", [staffId]);
      await conn.query("DELETE FROM counsellors WHERE user_id=?", [staffId]);
    } else if (role === "COORDINATOR") {
      await conn.query("DELETE FROM hods WHERE user_id=?", [staffId]);
      await conn.query("DELETE FROM counsellors WHERE user_id=?", [staffId]);
    } else if (role === "COUNSELLOR") {
      await conn.query("DELETE FROM hods WHERE user_id=?", [staffId]);
      await conn.query("DELETE FROM coordinators WHERE user_id=?", [staffId]);
    }

    // Insert or update role-specific table
    if (["HOD", "COORDINATOR", "COUNSELLOR"].includes(role) && deptId) {
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
    console.error("Update Staff Error:", err);
    res.status(500).json({ message: err.message || "Update failed" });
  } finally {
    conn.release();
  }
};

