import db from "../config/db.js";

/* ================= DEPARTMENTS ================= */
export const getDepartments = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, display_name FROM departments"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to load departments" });
  }
};

/* ================= COUNSELLORS BY DEPT ================= */
/* ================= STAFF BY DEPARTMENT (COUNSELLOR + COORDINATOR) ================= */
export const getStaffByDepartment = async (req, res) => {
  const { deptId } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        c.id AS staff_id,
        u.username,
        'COUNSELLOR' AS role
      FROM counsellors c
      JOIN users u ON u.id = c.user_id
      WHERE c.department_id = ?

      UNION ALL

      SELECT 
        co.id AS staff_id,
        u.username,
        'COORDINATOR' AS role
      FROM coordinators co
      JOIN users u ON u.id = co.user_id
      WHERE co.department_id = ?
      `,
      [deptId, deptId]
    );

    res.json(rows);
  } catch (err) {
    console.error("getStaffByDepartment:", err);
    res.status(500).json({ message: "Failed to load staff" });
  }
};

/* ================= GET ALL STUDENTS (FIXED) ================= */
export const getAllStudents = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
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

        /* 🔥 counsellor OR coordinator name */
        COALESCE(cu.username, co_u.username) AS counsellor

      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN departments d ON s.department_id = d.id

      /* counsellor mapping */
      LEFT JOIN counsellors c ON s.counsellor_id = c.id
      LEFT JOIN users cu ON cu.id = c.user_id

      /* coordinator mapping */
      LEFT JOIN coordinators co ON s.counsellor_id = co.id
      LEFT JOIN users co_u ON co_u.id = co.user_id

      ORDER BY s.year_of_study, u.username`
    );

    res.json(rows);
  } catch (err) {
    console.error("getAllStudents:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

/* ================= GET UNASSIGNED STUDENTS ================= */
export const getUnassignedStudents = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        s.id AS student_id,
        u.username,
        u.register_number,
        d.display_name AS department
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE s.counsellor_id IS NULL`
    );

    res.json(rows);
  } catch {
    res.status(500).json({ message: "Failed to load unassigned students" });
  }
};

/* ================= CREATE STUDENT ================= */
/* ================= CREATE STUDENT ================= */
export const createStudent = async (req, res) => {
  const {
    username,
    register_number,
    email,
    phone,
    student_type,
    department_id,
    staff_id = null, // counsellor OR coordinator
    year_of_study,
  } = req.body;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [userResult] = await conn.query(
      `INSERT INTO users
       (username, register_number, email, phone, role, student_type, is_first_login)
       VALUES (?, ?, ?, ?, 'STUDENT', ?, 1)`,
      [username, register_number, email, phone, student_type]
    );

    await conn.query(
      `INSERT INTO students
       (user_id, department_id, counsellor_id, year_of_study, student_type)
       VALUES (?, ?, ?, ?, ?)`,
      [
        userResult.insertId,
        department_id,
        staff_id || null,
        year_of_study,
        student_type,
      ]
    );

    await conn.commit();
    res.status(201).json({ message: "Student created successfully" });
  } catch (err) {
    await conn.rollback();
    console.error("createStudent:", err);
    res.status(500).json({ message: "Student creation failed" });
  } finally {
    conn.release();
  }
};


/* ================= ASSIGN STUDENT (COUNSELLOR / COORDINATOR) ================= */
export const assignStudentToCounsellor = async (req, res) => {
  const { studentId } = req.params;
  const { staffId } = req.body; // counsellor.id OR coordinator.id

  try {
    await db.query(
      `UPDATE students
       SET counsellor_id = ?
       WHERE id = ?`,
      [staffId, studentId]
    );

    res.json({ message: "Student assigned successfully" });
  } catch (err) {
    console.error("assignStudentToCounsellor:", err);
    res.status(500).json({ message: "Assignment failed" });
  }
};

/* ================= UPDATE STUDENT ================= */
/* ================= UPDATE STUDENT ================= */
export const updateStudent = async (req, res) => {
  const { studentId } = req.params;
  const {
    username,
    register_number,
    email,
    phone,
    student_type,
    department_id,
    staff_id, // counsellor OR coordinator
    year_of_study,
  } = req.body;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE users u
       JOIN students s ON u.id = s.user_id
       SET u.username=?, u.register_number=?, u.email=?, u.phone=?, u.student_type=?
       WHERE s.id=?`,
      [username, register_number, email, phone, student_type, studentId]
    );

    await conn.query(
      `UPDATE students
       SET department_id=?, counsellor_id=?, year_of_study=?, student_type=?
       WHERE id=?`,
      [
        department_id,
        staff_id || null,
        year_of_study,
        student_type,
        studentId,
      ]
    );

    await conn.commit();
    res.json({ message: "Student updated successfully" });
  } catch (err) {
    await conn.rollback();
    console.error("updateStudent:", err);
    res.status(500).json({ message: "Update failed" });
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

    const [[student]] = await conn.query(
      "SELECT user_id FROM students WHERE id=?",
      [studentId]
    );

    await conn.query("DELETE FROM students WHERE id=?", [studentId]);
    await conn.query("DELETE FROM users WHERE id=?", [student.user_id]);

    await conn.commit();
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    await conn.rollback();
    console.error("deleteStudent:", err);
    res.status(500).json({ message: "Delete failed" });
  } finally {
    conn.release();
  }
};
