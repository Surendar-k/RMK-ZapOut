import db from "../config/db.js";

// ================== FETCH ALL REQUESTS ==================
export const getAllStudentRequests = async (req, res) => {
  const { userId } = req.params;

  try {
    const [studentRows] = await db.query(
      `SELECT id FROM students WHERE user_id = ?`,
      [userId]
    );
    if (!studentRows.length)
      return res.status(404).json({ message: "Student not found" });

    const studentId = studentRows[0].id;

    const [requests] = await db.query(
      `SELECT 
        r.id, r.request_type, r.status, r.created_at,
        od.event_type, od.event_name, od.college, od.location, od.proof_file,
        od.from_date AS od_from_date, od.to_date AS od_to_date, od.total_days AS od_total_days,
        gp.reason, gp.out_time, gp.in_time,
        gp.from_date AS gp_from_date, gp.to_date AS gp_to_date,
        gp.time_of_leaving AS gp_time_of_leaving, gp.total_days AS gp_total_days
       FROM requests r
       LEFT JOIN on_duty_details od ON od.request_id = r.id
       LEFT JOIN gate_pass_details gp ON gp.request_id = r.id
       WHERE r.student_id = ?
       ORDER BY r.created_at DESC`,
      [studentId]
    );

    res.json({ requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================== CANCEL REQUEST ==================
export const cancelRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT status, request_type FROM requests WHERE id = ?`,
      [requestId]
    );
    if (!rows.length)
      return res.status(404).json({ message: "Request not found" });
    if (rows[0].status !== "SUBMITTED")
      return res
        .status(403)
        .json({ message: "Cannot cancel approved/rejected request" });

    // Delete dependent child rows first
    if (rows[0].request_type === "ON_DUTY") {
      await db.query(`DELETE FROM on_duty_details WHERE request_id = ?`, [
        requestId,
      ]);
    } else if (rows[0].request_type === "GATE_PASS") {
      await db.query(`DELETE FROM gate_pass_details WHERE request_id = ?`, [
        requestId,
      ]);
    }

    // Then delete the request itself
    await db.query(`DELETE FROM requests WHERE id = ?`, [requestId]);
    res.json({ message: "Request cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================== UPDATE REQUEST ==================
export const updateRequest = async (req, res) => {
  const { requestId } = req.params;
  const data = req.body;
  const proofFile = req.file ? req.file.filename : null;

  try {
    const [rows] = await db.query(
      `SELECT status, request_type FROM requests WHERE id = ?`,
      [requestId]
    );
    if (!rows.length)
      return res.status(404).json({ message: "Request not found" });
    if (rows[0].status !== "SUBMITTED")
      return res
        .status(403)
        .json({ message: "Cannot update approved/rejected request" });

    if (rows[0].request_type === "ON_DUTY") {
      const totalDays =
        Math.ceil(
          (new Date(data.toDate) - new Date(data.fromDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1;

      await db.query(
        `UPDATE on_duty_details SET
          event_type = ?, event_name = ?, college = ?, location = ?, 
          proof_file = IFNULL(?, proof_file),
          from_date = ?, to_date = ?, total_days = ?
         WHERE request_id = ?`,
        [
          data.eventType,
          data.eventName,
          data.college,
          data.location,
          proofFile,
          data.fromDate,
          data.toDate,
          totalDays,
          requestId,
        ]
      );
    } else if (rows[0].request_type === "GATE_PASS") {
      const totalDays =
        Math.ceil(
          (new Date(data.toDate) - new Date(data.fromDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1;
      // Helpers to normalize optional date/time fields
      const safeTime = (t) =>
        t && t !== "null" && t !== "undefined" ? t : null;
      const safeDate = (d) =>
        d && d !== "null" && d !== "undefined" ? d : null;

      await db.query(
        `UPDATE gate_pass_details SET
      reason = ?, out_time = ?, in_time = ?, from_date = ?, to_date = ?, total_days = ?
   WHERE request_id = ?`,
        [
          data.reason || null,
          safeTime(data.outTime),
          safeTime(data.inTime),
          safeDate(data.fromDate),
          safeDate(data.toDate),
          totalDays || null,
          requestId,
        ]
      );
    }

    res.json({ message: "Request updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//================STAFF REQUEST CONTROLLER==================

/* ================= STAFF REQUESTS ================= */
export const getStaffRequests = async (req, res) => {
  const { staffId, role } = req.params;

  // ✅ SAFETY CHECK
  if (!staffId || !role) {
    return res.status(400).json({ message: "staffId or role missing" });
  }

  try {
    let query = "";
    let params = [staffId];

    // ================= COUNSELLOR =================
    if (role === "COUNSELLOR") {
      query = `
        SELECT 
          r.id, r.request_type, r.status, r.created_at,
          u.username AS student_name,
          u.register_number,
          s.year_of_study,
          s.section,

          od.event_name,
          od.college,
          od.location,
          od.from_date AS od_from_date,
          od.to_date AS od_to_date,

          gp.reason,
          gp.from_date AS gp_from_date,
          gp.to_date AS gp_to_date

        FROM requests r
        JOIN students s ON r.student_id = s.id
        JOIN users u ON s.user_id = u.id
        JOIN counsellors c ON c.user_id = ?
        LEFT JOIN on_duty_details od ON od.request_id = r.id
        LEFT JOIN gate_pass_details gp ON gp.request_id = r.id
        WHERE s.counsellor_id = c.id
        ORDER BY r.created_at DESC
      `;
    }

    // ================= COORDINATOR =================
    else if (role === "COORDINATOR") {
      query = `
        SELECT 
          r.id, r.request_type, r.status, r.created_at,
          u.username AS student_name,
          u.register_number,
          s.year_of_study,
          s.section,

          od.event_name,
          od.college,
          od.location,
          od.from_date AS od_from_date,
          od.to_date AS od_to_date,

          gp.reason,
          gp.from_date AS gp_from_date,
          gp.to_date AS gp_to_date

        FROM requests r
        JOIN students s ON r.student_id = s.id
        JOIN users u ON s.user_id = u.id
        JOIN coordinators c ON c.user_id = ?
        LEFT JOIN on_duty_details od ON od.request_id = r.id
        LEFT JOIN gate_pass_details gp ON gp.request_id = r.id
        WHERE s.department_id = c.department_id
          AND r.status = 'COUNSELLOR_APPROVED'
          AND s.year_of_study = c.year  -- filter by coordinator's year
        ORDER BY r.created_at DESC
      `;
    }

    // ================= HOD =================
    else if (role === "HOD") {
      query = `
        SELECT 
          r.id, r.request_type, r.status, r.created_at,
          u.username AS student_name,
          u.register_number,
          s.year_of_study,
          s.section,

          od.event_name,
          od.college,
          od.location,
          od.from_date AS od_from_date,
          od.to_date AS od_to_date,

          gp.reason,
          gp.from_date AS gp_from_date,
          gp.to_date AS gp_to_date

        FROM requests r
        JOIN students s ON r.student_id = s.id
        JOIN users u ON s.user_id = u.id
        JOIN hods h ON h.user_id = ?
        LEFT JOIN on_duty_details od ON od.request_id = r.id
        LEFT JOIN gate_pass_details gp ON gp.request_id = r.id
        WHERE s.department_id = h.department_id
          AND r.status = 'COORDINATOR_APPROVED'
        ORDER BY r.created_at DESC
      `;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    const [rows] = await db.query(query, params);
    res.json({ requests: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE STATUS ================= */
export const updateRequestStatus = async (req, res) => {
  const { requestId } = req.params;
  const { role, action } = req.body;

  let nextStatus = "REJECTED";

  if (action === "APPROVE") {
    if (role === "COUNSELLOR") nextStatus = "COUNSELLOR_APPROVED";
    else if (role === "COORDINATOR") nextStatus = "COORDINATOR_APPROVED";
    else if (role === "HOD") nextStatus = "HOD_APPROVED";
  }

  await db.query("UPDATE requests SET status=? WHERE id=?", [
    nextStatus,
    requestId,
  ]);

  res.json({ status: nextStatus });
};
