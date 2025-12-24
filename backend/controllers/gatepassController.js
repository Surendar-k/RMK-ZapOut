import db from "../config/db.js";

// ================= FETCH STUDENT INFO =================working fine
export const getStudentInfo = async (req, res) => {
  const { studentId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT u.username, u.register_number, u.email, u.phone, u.role,
              s.year_of_study AS year,
              s.guardian_name, s.guardian_address, s.guardian_mobile,
              s.hostel_name, s.room_number, s.student_type, s.section,
              s.father_name, s.father_mobile, s.mother_name, s.mother_mobile,
              d.name AS department
       FROM students s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN departments d ON s.department_id = d.id
       WHERE u.id = ?`,
      [studentId]
    );

    if (!rows.length) return res.status(404).json({ message: "Student not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= APPLY GATEPASS =================working fine

export const applyGatepass = async (req, res) => {
  const {
    student_id,
    from_date,
    to_date, // Expected Return
    out_time,
    reason,
    guardian_name,
    guardian_mobile,
    guardian_address,
  } = req.body;

  try {
    // Get student DB ID
    const [studentRows] = await db.query(
      `SELECT id FROM students WHERE user_id = ?`,
      [student_id]
    );
    if (!studentRows.length) return res.status(404).json({ message: "Student not found" });

    const studentDbId = studentRows[0].id;

    // Insert into requests table
    const [requestResult] = await db.query(
      `INSERT INTO requests (student_id, request_type, status)
       VALUES (?, 'GATE_PASS', 'SUBMITTED')`,
      [studentDbId]
    );
    const requestId = requestResult.insertId;

    // Calculate total_days
    const totalDays = Math.floor(
      (new Date(to_date) - new Date(from_date)) / (1000 * 60 * 60 * 24)
    ) + 1;

    // Insert into gate_pass_details
   // Insert into gate_pass_details
await db.query(
  `INSERT INTO gate_pass_details
   (request_id, reason, out_time, from_date, to_date, in_time, time_of_leaving, total_days)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  [requestId, reason, out_time, from_date, to_date, null, out_time, totalDays]
);


    // Update guardian info
    await db.query(
      `UPDATE students 
       SET guardian_name = ?, guardian_mobile = ?, guardian_address = ?
       WHERE id = ?`,
      [guardian_name, guardian_mobile, guardian_address, studentDbId]
    );

    res.status(201).json({ message: "Gatepass submitted successfully", requestId });
  } catch (err) {
    console.error("Gatepass submission error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

