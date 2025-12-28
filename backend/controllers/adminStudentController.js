import db from "../config/db.js";

/* ================= DEPARTMENTS ================= */
export const getDepartments = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, display_name FROM departments"
    );
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Failed to load departments" });
  }
};

/* ================= COUNSELLORS BY DEPT ================= */
export const getCounsellorsByDepartment = async (req, res) => {
  const { deptId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT c.id, u.username
       FROM counsellors c
       JOIN users u ON c.user_id = u.id
       WHERE c.department_id = ?`,
      [deptId]
    );
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Failed to load counsellors" });
  }
};

/* ================= GET ALL STUDENTS ================= */
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
        cu.username AS counsellor
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN counsellors c ON s.counsellor_id = c.id
      LEFT JOIN users cu ON c.user_id = cu.id`
    );

    res.json(rows);
  } catch {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

/* ================= CREATE STUDENT ================= */
export const createStudent = async (req, res) => {
  const {
    username,
    register_number,
    email,
    phone,
    student_type,
    department_id,
    counsellor_id,
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
      [userResult.insertId, department_id, counsellor_id, year_of_study, student_type]
    );

    await conn.commit();
    res.status(201).json({ message: "Student created successfully" });
  } catch {
    await conn.rollback();
    res.status(500).json({ message: "Student creation failed" });
  } finally {
    conn.release();
  }
};

/* ================= UPDATE STUDENT (FULL) ================= */
export const updateStudent = async (req, res) => {
  const { studentId } = req.params;
  const {
    username,
    register_number,
    email,
    phone,
    student_type,
    department_id,
    counsellor_id,
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
      [department_id, counsellor_id, year_of_study, student_type, studentId]
    );

    await conn.commit();
    res.json({ message: "Student updated successfully" });
  } catch {
    await conn.rollback();
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
  } catch {
    await conn.rollback();
    res.status(500).json({ message: "Delete failed" });
  } finally {
    conn.release();
  }
};
