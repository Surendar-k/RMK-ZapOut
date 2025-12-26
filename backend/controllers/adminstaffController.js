import db from "../config/db.js";
import bcrypt from "bcryptjs";

/* CREATE STAFF */
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

    const [[dept]] = await conn.query(
      "SELECT id FROM departments WHERE name=?",
      [department]
    );

    const password = "Welcome@123";
    const hash = await bcrypt.hash(password, 10);

    const [user] = await conn.query(
      `INSERT INTO users (username,email,phone,password_hash,role,is_active)
       VALUES (?,?,?,?,?,1)`,
      [username, email, phone, hash, role]
    );

    // Only certain roles have a department
    if (["COUNSELLOR", "COORDINATOR", "HOD"].includes(role) && dept) {
      await conn.query(
        `INSERT INTO counsellors (user_id, department_id) VALUES (?, ?)`,
        [user.insertId, dept.id]
      );
    }

    await conn.commit();
    res.status(201).json({ message: "Staff created" });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: "Create failed" });
  } finally {
    conn.release();
  }
};

/* GET STAFFS */
export const getStaffs = async (req, res) => {
  const [rows] = await db.query(`
    SELECT u.id, u.username, u.email, u.phone, u.role, u.is_active,
           d.name AS department
    FROM users u
    LEFT JOIN counsellors c ON c.user_id = u.id
    LEFT JOIN departments d ON d.id = c.department_id
    WHERE u.role <> 'STUDENT'
  `);
  res.json(rows);
};

/* DELETE STAFF */
export const deleteStaff = async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.query;

  const conn = await db.getConnection();
  try {
    const [[admin]] = await conn.query("SELECT role FROM users WHERE id=?", [adminId]);
    if (!admin || admin.role !== "ADMIN") return res.status(403).json({ message: "Access denied" });

    await conn.beginTransaction();
    await conn.query("DELETE FROM counsellors WHERE user_id=?", [id]);
    await conn.query("DELETE FROM users WHERE id=?", [id]);
    await conn.commit();

    res.json({ message: "Staff deleted" });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  } finally {
    conn.release();
  }
};

/* UPDATE STAFF */
export const updateStaff = async (req, res) => {
  const staffId = req.params.id;
  const { adminId, username, email, phone, role, department, userId } = req.body;

  const conn = await db.getConnection();
  try {
    const [[user]] = await conn.query("SELECT id, role, is_active FROM users WHERE id=?", [adminId || userId]);
    if (!user) return res.status(403).json({ message: "Access denied" });

    if (user.role === "ADMIN") {
      if (department) {
        const [[dept]] = await conn.query("SELECT id FROM departments WHERE name=?", [department]);
        if (dept) {
          await conn.query("INSERT INTO counsellors (user_id, department_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE department_id=?", 
            [staffId, dept.id, dept.id]);
        }
      }
      await conn.query(
        "UPDATE users SET username=?, email=?, phone=?, role=? WHERE id=?",
        [username, email, phone, role, staffId]
      );
      return res.json({ message: "Staff updated successfully" });
    }

    // Staff themselves can update only if active
    if (user.id === staffId && user.is_active) {
      await conn.query("UPDATE users SET username=?, email=?, phone=? WHERE id=?", [username, email, phone, staffId]);
      return res.json({ message: "Profile updated successfully" });
    }

    res.status(403).json({ message: "Access denied" });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  } finally {
    conn.release();
  }
};
