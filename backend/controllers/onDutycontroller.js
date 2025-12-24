import db from "../config/db.js";

/* ================== STUDENT PROFILE ================== working fine */
export const getStudentProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT 
         u.username, u.register_number, u.email, u.role,
         s.student_type, s.year_of_study, d.name AS department
       FROM users u
       JOIN students s ON s.user_id = u.id
       LEFT JOIN departments d ON d.id = s.department_id
       WHERE u.id = ?`,
      [userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Profile not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================== APPLY ON-DUTY ================== working fine*/
export const applyOnDuty = async (req, res) => {
  const { userId, eventType, eventName, college, location, fromDate, toDate } = req.body;
  const proofFile = req.file ? req.file.filename : null;

  if (!userId || !eventType || !eventName || !college || !location || !fromDate || !toDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [userRows] = await db.query(
      `SELECT id, role FROM users WHERE id = ? AND is_active = 1`,
      [userId]
    );

    if (userRows.length === 0) return res.status(404).json({ message: "User not found" });
    if (userRows[0].role !== "STUDENT") return res.status(403).json({ message: "Only students can apply" });

    const [studentRows] = await db.query(
      `SELECT id FROM students WHERE user_id = ?`,
      [userId]
    );

    if (studentRows.length === 0) return res.status(404).json({ message: "Student record missing" });

    const studentId = studentRows[0].id;
    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (to < from) return res.status(400).json({ message: "Invalid date range" });

    const totalDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

    // 1️⃣ Insert into main requests table
    const [requestResult] = await db.query(
      `INSERT INTO requests (student_id, request_type) VALUES (?, 'ON_DUTY')`,
      [studentId]
    );

    const requestId = requestResult.insertId;

    // 2️⃣ Insert into on_duty_details table
    await db.query(
      `INSERT INTO on_duty_details
      (request_id, event_type, event_name, college, location, proof_file, from_date, to_date, total_days)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [requestId, eventType, eventName, college, location, proofFile, fromDate, toDate, totalDays]
    );

    res.status(201).json({ message: "On-Duty applied successfully", requestId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

