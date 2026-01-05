import db from "../config/db.js";

/* =========================================
   GET DEPARTMENT STUDENTS
   (Counsellor / Coordinator / HOD)
========================================= */
export const getDepartmentStudents = async (req, res) => {
  try {
    const { userId, role } = req.query;

    if (!userId || !role) return res.json([]);
    if (!["COUNSELLOR", "COORDINATOR", "HOD"].includes(role))
      return res.json([]);

    /* 1️⃣ Get department of logged-in staff */
    let deptQuery = "";

    if (role === "COUNSELLOR")
      deptQuery = `SELECT department_id FROM counsellors WHERE user_id = ?`;
    else if (role === "COORDINATOR")
      deptQuery = `SELECT department_id FROM coordinators WHERE user_id = ?`;
    else if (role === "HOD")
      deptQuery = `SELECT department_id FROM hods WHERE user_id = ?`;

    const [deptRows] = await db.query(deptQuery, [userId]);
    if (deptRows.length === 0) return res.json([]);

    const departmentId = deptRows[0].department_id;

    /* 2️⃣ Fetch students + assigned staff (Counsellor OR Coordinator) */
    const [students] = await db.query(
      `
      SELECT 
        s.id,
        u.username AS name,
        u.register_number,
        u.email,
        u.phone,
        d.display_name AS department,
        s.year_of_study,
        s.student_type,
        s.counsellor_id,

        /* Show counsellor OR coordinator name */
        COALESCE(cu.username, co_u.username) AS assigned_staff

      FROM students s
      JOIN users u ON u.id = s.user_id
      JOIN departments d ON d.id = s.department_id

      /* Counsellor join */
      LEFT JOIN counsellors c ON c.id = s.counsellor_id
      LEFT JOIN users cu ON cu.id = c.user_id

      /* Coordinator join */
      LEFT JOIN coordinators co ON co.id = s.counsellor_id
      LEFT JOIN users co_u ON co_u.id = co.user_id

      WHERE s.department_id = ?
      ORDER BY s.year_of_study, u.username
      `,
      [departmentId]
    );

    res.json(students);
  } catch (error) {
    console.error("getDepartmentStudents:", error);
    res.status(500).json([]);
  }
};

/* =========================================
   GET MY STUDENTS
   (Counsellor OR Coordinator)
========================================= */
export const getMyStudents = async (req, res) => {
  try {
    const { userId, role } = req.query;

    if (!userId || !["COUNSELLOR", "COORDINATOR"].includes(role))
      return res.json([]);

    /* 1️⃣ Get staff table ID */
    const [staffRows] = await db.query(
      `
      SELECT id FROM counsellors WHERE user_id = ?
      UNION ALL
      SELECT id FROM coordinators WHERE user_id = ?
      `,
      [userId, userId]
    );

    if (staffRows.length === 0) return res.json([]);

    const staffTableId = staffRows[0].id;

    /* 2️⃣ Fetch assigned students */
    const [students] = await db.query(
      `
      SELECT 
        s.id,
        u.username AS name,
        u.register_number,
        u.email,
        u.phone,
        d.display_name AS department,
        s.year_of_study,
        s.student_type
      FROM students s
      JOIN users u ON u.id = s.user_id
      JOIN departments d ON d.id = s.department_id
      WHERE s.counsellor_id = ?
      ORDER BY s.year_of_study, u.username
      `,
      [staffTableId]
    );

    res.json(students);
  } catch (error) {
    console.error("getMyStudents:", error);
    res.status(500).json([]);
  }
};

/* =========================================
   ASSIGN STUDENT
   (Counsellor OR Coordinator)
========================================= */
export const assignStudent = async (req, res) => {
  try {
    const { staffUserId } = req.body; // users.id
    const studentId = req.params.id;

    if (!staffUserId || !studentId)
      return res.status(400).json({
        success: false,
        message: "Missing studentId or staffUserId",
      });

    /* 1️⃣ Find staff in counsellors / coordinators */
    const [staffRows] = await db.query(
      `
      SELECT id FROM counsellors WHERE user_id = ?
      UNION ALL
      SELECT id FROM coordinators WHERE user_id = ?
      `,
      [staffUserId, staffUserId]
    );

    if (staffRows.length === 0)
      return res.status(403).json({
        success: false,
        message: "Only counsellor or coordinator can be assigned",
      });

    const staffTableId = staffRows[0].id;

    /* 2️⃣ Assign student */
    await db.query(
      `UPDATE students SET counsellor_id = ? WHERE id = ?`,
      [staffTableId, studentId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("assignStudent:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================
   UNASSIGN STUDENT
========================================= */
export const unassignStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    if (!studentId)
      return res.status(400).json({
        success: false,
        message: "Missing studentId",
      });

    await db.query(
      `UPDATE students SET counsellor_id = NULL WHERE id = ?`,
      [studentId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("unassignStudent:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
