import db from "../config/db.js";

/* =====================================================
   STUDENT SIDE
===================================================== */

/* ================= FETCH ALL STUDENT REQUESTS ================= */
export const getAllStudentRequests = async (req, res) => {
  const { userId } = req.params;

  try {
    const [studentRows] = await db.query(
      `SELECT id FROM students WHERE user_id = ?`,
      [userId]
    );

    if (!studentRows.length) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentId = studentRows[0].id;

    const [requests] = await db.query(
      `SELECT 
        r.id,
        r.request_type,
        r.status,
        r.current_stage,
        r.rejected_by,
        r.rejection_reason,
        r.created_at,

        od.event_type,
        od.event_name,
        od.college,
        od.location,
        od.proof_file,
        od.from_date AS od_from_date,
        od.to_date AS od_to_date,
        od.total_days AS od_total_days,

        gp.reason,
        gp.out_time,
        gp.in_time,
        gp.from_date AS gp_from_date,
        gp.to_date AS gp_to_date,
        gp.total_days AS gp_total_days

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

/* ================= CANCEL REQUEST ================= */
export const cancelRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT status, request_type FROM requests WHERE id = ?`,
      [requestId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (rows[0].status !== "SUBMITTED") {
      return res
        .status(403)
        .json({ message: "Only submitted requests can be cancelled" });
    }

    if (rows[0].request_type === "ON_DUTY") {
      await db.query(`DELETE FROM on_duty_details WHERE request_id = ?`, [
        requestId,
      ]);
    } else {
      await db.query(`DELETE FROM gate_pass_details WHERE request_id = ?`, [
        requestId,
      ]);
    }

    await db.query(`DELETE FROM requests WHERE id = ?`, [requestId]);

    res.json({ message: "Request cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE REQUEST ================= */
export const updateRequest = async (req, res) => {
  const { requestId } = req.params;
  const data = req.body;
  const proofFile = req.file ? req.file.filename : null;

  try {
    const [rows] = await db.query(
      `SELECT status, request_type FROM requests WHERE id = ?`,
      [requestId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (rows[0].status !== "SUBMITTED") {
      return res
        .status(403)
        .json({ message: "Cannot update after approval/rejection" });
    }

    if (rows[0].request_type === "ON_DUTY") {
      const totalDays =
        Math.ceil(
          (new Date(data.toDate) - new Date(data.fromDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1;

      await db.query(
        `UPDATE on_duty_details SET
          event_type = ?,
          event_name = ?,
          college = ?,
          location = ?,
          proof_file = IFNULL(?, proof_file),
          from_date = ?,
          to_date = ?,
          total_days = ?
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
    } else {
      const totalDays =
        Math.ceil(
          (new Date(data.toDate) - new Date(data.fromDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1;

      await db.query(
        `UPDATE gate_pass_details SET
          reason = ?,
          out_time = ?,
          in_time = ?,
          from_date = ?,
          to_date = ?,
          total_days = ?
        WHERE request_id = ?`,
        [
          data.reason || null,
          data.outTime || null,
          data.inTime || null,
          data.fromDate || null,
          data.toDate || null,
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

/* =====================================================
   STAFF SIDE
===================================================== */

/* ================= FETCH STAFF REQUESTS ================= */
export const getStaffRequests = async (req, res) => {
  const { staffId, role } = req.params;

  if (!staffId || !role) {
    return res.status(400).json({ message: "staffId or role missing" });
  }

  try {
    let query = "";
    let params = [staffId];

 const baseSelect = `
  SELECT
    r.id,
    r.request_type,
    r.status,
    r.current_stage,
    r.rejected_by,
    r.rejection_reason,
    r.created_at,

    u.username AS student_name,
    u.register_number,

    od.event_type,
    od.event_name,
    od.college,
    od.location,
    od.from_date AS od_from_date,
    od.to_date AS od_to_date,
    od.total_days AS od_total_days,

    gp.reason,
    gp.from_date AS gp_from_date,
    gp.to_date AS gp_to_date,
    gp.total_days AS gp_total_days
  FROM requests r
  JOIN students s ON r.student_id = s.id
  JOIN users u ON s.user_id = u.id
  LEFT JOIN on_duty_details od ON od.request_id = r.id
  LEFT JOIN gate_pass_details gp ON gp.request_id = r.id
`;


    if (role === "COUNSELLOR") {
      query = `
        ${baseSelect}
        JOIN counsellors c ON c.user_id = ?
        WHERE s.counsellor_id = c.id
          AND r.current_stage = 'COUNSELLOR'
        ORDER BY r.created_at DESC
      `;
    }

    else if (role === "COORDINATOR") {
      query = `
        ${baseSelect}
        JOIN coordinators c ON c.user_id = ?
        WHERE r.current_stage = 'COORDINATOR'
          AND s.department_id = c.department_id
          AND s.year_of_study = c.year
        ORDER BY r.created_at DESC
      `;
    }

    else if (role === "HOD") {
      query = `
        ${baseSelect}
        JOIN hods h ON h.user_id = ?
        WHERE r.current_stage = 'HOD'
          AND s.department_id = h.department_id
        ORDER BY r.created_at DESC
      `;
    }

    else {
      return res.status(400).json({ message: "Invalid role" });
    }

    const [rows] = await db.query(query, params);
    res.json({ requests: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= UPDATE REQUEST STATUS ================= */
export const updateRequestStatus = async (req, res) => {
  const { requestId } = req.params;
  const { role, action, rejectionReason } = req.body;

  try {
    if (action === "REJECT") {
      // Update DB
      const [result] = await db.query(
        `UPDATE requests SET
          status = 'REJECTED',
          rejected_by = ?,
          rejection_reason = ?
        WHERE id = ?`,
        [role, rejectionReason || null, requestId]
      );

      // Fetch updated row
      const [updatedRows] = await db.query(
        `SELECT status, rejected_by, rejection_reason, current_stage FROM requests WHERE id = ?`,
        [requestId]
      );

      return res.json(updatedRows[0]); // Send full updated row
    }

    // Approval logic...
    let nextStage = null;
    let nextStatus = null;

    if (role === "COUNSELLOR") {
      nextStage = "COORDINATOR";
      nextStatus = "COUNSELLOR_APPROVED";
    } else if (role === "COORDINATOR") {
      nextStage = "HOD";
      nextStatus = "COORDINATOR_APPROVED";
    } else if (role === "HOD") {
      nextStage = "WARDEN";
      nextStatus = "HOD_APPROVED";
    }

    await db.query(
      `UPDATE requests SET status = ?, current_stage = ? WHERE id = ?`,
      [nextStatus, nextStage, requestId]
    );

    res.json({ status: nextStatus, current_stage: nextStage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
