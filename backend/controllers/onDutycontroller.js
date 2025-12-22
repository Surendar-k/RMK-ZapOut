import db from "../config/db.js";

/* ================== STUDENT PROFILE ================== */
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

/* ================== APPLY ON-DUTY ================== */
export const applyOnDuty = async (req, res) => {
  const { userId, eventType, eventName, college, location, fromDate, toDate } =
    req.body;
  const proofFile = req.file ? req.file.filename : null;

  if (
    !userId ||
    !eventType ||
    !eventName ||
    !college ||
    !location ||
    !fromDate ||
    !toDate
  )
    return res.status(400).json({ message: "All fields are required" });

  try {
    const [userRows] = await db.query(
      `SELECT id, role FROM users WHERE id = ? AND is_active = 1`,
      [userId]
    );

    if (userRows.length === 0)
      return res.status(404).json({ message: "User not found" });
    if (userRows[0].role !== "STUDENT")
      return res.status(403).json({ message: "Only students can apply" });

    const [studentRows] = await db.query(
      `SELECT id FROM students WHERE user_id = ?`,
      [userId]
    );
    if (studentRows.length === 0)
      return res.status(404).json({ message: "Student record missing" });

    const studentId = studentRows[0].id;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (to < from)
      return res.status(400).json({ message: "Invalid date range" });

    const totalDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

    const [requestResult] = await db.query(
      `INSERT INTO requests (student_id, request_type, from_date, to_date, total_days)
       VALUES (?, 'ON_DUTY', ?, ?, ?)`,
      [studentId, fromDate, toDate, totalDays]
    );

    const requestId = requestResult.insertId;

    await db.query(
      `INSERT INTO on_duty_details (request_id, event_type, event_name, college, location, proof_file)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [requestId, eventType, eventName, college, location, proofFile]
    );

    res
      .status(201)
      .json({ message: "On-Duty applied successfully", requestId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
/* ================== GET ALL LIVE/UNAPPROVED REQUESTS ================== */
export const getOnDutyRequests = async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. Get student ID
    const [studentRows] = await db.query(
      `SELECT id FROM students WHERE user_id = ?`,
      [userId]
    );
    if (studentRows.length === 0)
      return res.status(404).json({ message: "Student not found" });

    const studentId = studentRows[0].id;

    // 2. Fetch all requests created by the student that are not fully approved
    const [requests] = await db.query(
      `SELECT r.id, r.request_type, r.from_date, r.to_date, r.status, r.created_at,
              od.event_type, od.event_name, od.college, od.location, od.proof_file
       FROM requests r
       JOIN on_duty_details od ON od.request_id = r.id
       WHERE r.student_id = ?
         AND r.status NOT IN ('WARDEN_APPROVED', 'REJECTED')
       ORDER BY r.created_at DESC`,
      [studentId]
    );

    res.json({ requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================== GET SINGLE REQUEST ================== */
export const getOnDutyRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT r.id, r.student_id, r.from_date, r.to_date, r.status, r.total_days,
              od.event_type, od.event_name, od.college, od.location, od.proof_file
       FROM requests r
       JOIN on_duty_details od ON od.request_id = r.id
       WHERE r.id = ?`,
      [requestId]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Request not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================== UPDATE REQUEST ================== */
export const updateOnDutyRequest = async (req, res) => {
  const { requestId } = req.params;
  const { eventType, eventName, college, location, fromDate, toDate } =
    req.body;
  const proofFile = req.file ? req.file.filename : null;

  try {
    const [requestRows] = await db.query(
      `SELECT * FROM requests WHERE id = ?`,
      [requestId]
    );
    if (requestRows.length === 0)
      return res.status(404).json({ message: "Request not found" });

    // Allow update only before Counsellor approval
    if (!["SUBMITTED"].includes(requestRows[0].status))
      return res
        .status(400)
        .json({ message: "Only pending requests can be updated" });

    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (to < from)
      return res.status(400).json({ message: "Invalid date range" });

    const totalDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

    await db.query(
      `UPDATE requests SET from_date = ?, to_date = ?, total_days = ? WHERE id = ?`,
      [fromDate, toDate, totalDays, requestId]
    );

    await db.query(
      `UPDATE on_duty_details
       SET event_type = ?, event_name = ?, college = ?, location = ?, proof_file = COALESCE(?, proof_file)
       WHERE request_id = ?`,
      [eventType, eventName, college, location, proofFile, requestId]
    );

    res.json({ message: "Request updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================== CANCEL REQUEST ================== */
export const cancelOnDutyRequestController = async (req, res) => {
  const { requestId } = req.params;

  try {
    // 1. Fetch the request
    const [requestRows] = await db.query(
      `SELECT * FROM requests WHERE id = ?`,
      [requestId]
    );

    if (requestRows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const request = requestRows[0];

    // 2. Only allow cancellation if status is SUBMITTED (before Counsellor approval)
    if (request.status !== "SUBMITTED") {
      return res
        .status(400)
        .json({ message: "Cannot cancel request after Counsellor approval" });
    }

    // 3. Delete related on_duty_details first (foreign key dependency)
    await db.query(`DELETE FROM on_duty_details WHERE request_id = ?`, [
      requestId,
    ]);

    // 4. Delete the request
    await db.query(`DELETE FROM requests WHERE id = ?`, [requestId]);

    res.json({ message: "Request canceled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
