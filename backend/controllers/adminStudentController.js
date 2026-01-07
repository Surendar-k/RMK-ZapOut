import db from "../config/db.js";

/* ================= DEPARTMENTS ================= */
export const getDepartments = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, display_name FROM departments");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to load departments" });
  }
};

/* ================= STAFF BY DEPARTMENT ================= */
/* Supports optional query param: ?academic_type=BASE_DEPT or CORE_DEPT */
export const getStaffByDepartment = async (req, res) => {
  const { deptId } = req.params;
  const { academic_type } = req.query; // optional filter

  try {
    const query = `
      SELECT c.id AS staff_id, u.username, 'COUNSELLOR' AS role
      FROM counsellors c
      JOIN users u ON u.id = c.user_id
      WHERE c.department_id = ? ${academic_type ? "AND c.academic_type = ?" : ""}

      UNION ALL

      SELECT co.id AS staff_id, u.username, 'COORDINATOR' AS role
      FROM coordinators co
      JOIN users u ON u.id = co.user_id
      WHERE co.department_id = ? ${academic_type ? "AND co.academic_type = ?" : ""}
    `;

    const params = academic_type ? [deptId, academic_type, deptId, academic_type] : [deptId, deptId];
    const [rows] = await db.query(query, params);

    res.json(rows);
  } catch (err) {
    console.error("getStaffByDepartment:", err);
    res.status(500).json({ message: "Failed to load staff" });
  }
};

/* ================= GET ALL STUDENTS ================= */
export const getAllStudents = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.id AS student_id,
        u.username,
        u.register_number,
        u.email,
        u.phone,
        s.student_type,
        s.year_of_study,
        s.department_id,
        s.counsellor_id,
        d.display_name AS department,
        COALESCE(cu.username, co_u.username) AS counsellor
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN counsellors c ON s.counsellor_id = c.id
      LEFT JOIN users cu ON cu.id = c.user_id
      LEFT JOIN coordinators co ON s.counsellor_id = co.id
      LEFT JOIN users co_u ON co_u.id = co.user_id
      ORDER BY s.year_of_study, u.username
    `);

    res.json(rows);
  } catch (err) {
    console.error("getAllStudents:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

/* ================= CREATE STUDENT ================= */
export const createStudent = async (req, res) => {
  const { username, register_number, email, phone, student_type, department_id, staff_id = null, year_of_study } = req.body;
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Insert user
    const [userResult] = await conn.query(
      `INSERT INTO users (username, register_number, email, phone, role, student_type, is_first_login)
       VALUES (?, ?, ?, ?, 'STUDENT', ?, 1)`,
      [username, register_number, email, phone, student_type]
    );

    // Restrict BASE_DEPT staff for year 1
    if (year_of_study == 1 && staff_id) {
      const [[staff]] = await conn.query(
        `SELECT academic_type FROM counsellors WHERE id=? 
         UNION ALL 
         SELECT academic_type FROM coordinators WHERE id=?`,
        [staff_id, staff_id]
      );

      if (!staff || staff.academic_type !== "BASE_DEPT") {
        throw new Error("Only BASE_DEPT staff can be assigned 1st-year students");
      }
    }

    // Insert student
    await conn.query(
      `INSERT INTO students (user_id, department_id, counsellor_id, year_of_study, student_type)
       VALUES (?, ?, ?, ?, ?)`,
      [userResult.insertId, department_id, staff_id || null, year_of_study, student_type]
    );

    await conn.commit();
    res.status(201).json({ message: "Student created successfully" });
  } catch (err) {
    await conn.rollback();
    console.error("createStudent:", err);
    res.status(500).json({ message: err.message || "Student creation failed" });
  } finally {
    conn.release();
  }
};

/* ================= UPDATE STUDENT ================= */
export const updateStudent = async (req, res) => {
  const { studentId } = req.params;
  const { username, register_number, email, phone, student_type, department_id, staff_id, year_of_study } = req.body;
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Restrict BASE_DEPT staff for year 1
    if (year_of_study == 1 && staff_id) {
      const [[staff]] = await conn.query(
        `SELECT academic_type FROM counsellors WHERE id=? 
         UNION ALL 
         SELECT academic_type FROM coordinators WHERE id=?`,
        [staff_id, staff_id]
      );

      if (!staff || staff.academic_type !== "BASE_DEPT") {
        throw new Error("Only BASE_DEPT staff can be assigned 1st-year students");
      }
    }

    // Update user
    await conn.query(
      `UPDATE users u
       JOIN students s ON u.id = s.user_id
       SET u.username=?, u.register_number=?, u.email=?, u.phone=?, u.student_type=?
       WHERE s.id=?`,
      [username, register_number, email, phone, student_type, studentId]
    );

    // Update student
    await conn.query(
      `UPDATE students
       SET department_id=?, counsellor_id=?, year_of_study=?, student_type=?
       WHERE id=?`,
      [department_id, staff_id || null, year_of_study, student_type, studentId]
    );

    await conn.commit();
    res.json({ message: "Student updated successfully" });
  } catch (err) {
    await conn.rollback();
    console.error("updateStudent:", err);
    res.status(500).json({ message: err.message || "Update failed" });
  } finally {
    conn.release();
  }
};

/* ================= DELETE STUDENT ================= */
export const deleteStudent = async (req, res) => {
  const { studentId } = req.params;
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();
    const [[student]] = await conn.query("SELECT user_id FROM students WHERE id=?", [studentId]);

    if (!student) throw new Error("Student not found");

    await conn.query("DELETE FROM students WHERE id=?", [studentId]);
    await conn.query("DELETE FROM users WHERE id=?", [student.user_id]);

    await conn.commit();
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    await conn.rollback();
    console.error("deleteStudent:", err);
    res.status(500).json({ message: err.message || "Delete failed" });
  } finally {
    conn.release();
  }
};

/* ================= ASSIGN STUDENT TO STAFF ================= */
export const assignStudentToCounsellor = async (req, res) => {
  const { studentId } = req.params;
  const { staffId } = req.body;

  try {
    // Restrict BASE_DEPT for year 1
    const [[student]] = await db.query("SELECT year_of_study FROM students WHERE id=?", [studentId]);
    if (!student) throw new Error("Student not found");

    if (student.year_of_study == 1 && staffId) {
      const [[staff]] = await db.query(
        `SELECT academic_type FROM counsellors WHERE id=? 
         UNION ALL 
         SELECT academic_type FROM coordinators WHERE id=?`,
        [staffId, staffId]
      );

      if (!staff || staff.academic_type !== "BASE_DEPT") {
        return res.status(403).json({ message: "Only BASE_DEPT staff can be assigned 1st-year students" });
      }
    }

    await db.query(`UPDATE students SET counsellor_id=? WHERE id=?`, [staffId, studentId]);
    res.json({ message: "Student assigned successfully" });
  } catch (err) {
    console.error("assignStudentToCounsellor:", err);
    res.status(500).json({ message: err.message || "Assignment failed" });
  }
};
