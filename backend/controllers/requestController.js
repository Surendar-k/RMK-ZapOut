import db from "../config/db.js";
import { getIO } from "../config/socket.js";

import { sendNotification } from "./notifications/staffNotificationController.js";

export const notifyNextApprovers = async (
  nextStage,
  reqRow,
  requestId
) => {
  let users = [];
const io = getIO();

/* ================= NOTIFY NEXT STAGE ================= */

// ▶ Counsellor → Coordinator
if (nextStage === "COORDINATOR") {
  const [[coord]] = await db.query(
    `SELECT c.user_id
     FROM coordinators c
     WHERE c.department_id = ?
       AND c.year = ?`,
    [reqRow.department_id, reqRow.student_year]
  );

  if (coord?.user_id) {
    await sendNotification(
      coord.user_id,
      "New request pending your approval",
      "approval"
    );
    io.to(`user_${coord.user_id}`).emit("newRequest");
  }
}

// ▶ Coordinator → HOD  ✅ THIS WAS MISSING
if (nextStage === "HOD") {
  const [[hod]] = await db.query(
    `SELECT h.user_id
     FROM hods h
     WHERE h.department_id = ?`,
    [reqRow.department_id]
  );

  if (hod?.user_id) {
    await sendNotification(
      hod.user_id,
      "New request pending HOD approval",
      "approval"
    );
    io.to(`user_${hod.user_id}`).emit("newRequest"); // 🔥 BADGE FIX
  }
}

// ▶ HOD → Warden
if (nextStage === "WARDEN") {
  const [[warden]] = await db.query(
    `SELECT user_id FROM wardens LIMIT 1`
  );

  if (warden?.user_id) {
    await sendNotification(
      warden.user_id,
      "New request pending Warden approval",
      "approval"
    );
    io.to(`user_${warden.user_id}`).emit("newRequest");
  }
}

  for (const u of users) {
    // 🔔 notification
    await sendNotification(
      u.user_id,
      "New request pending your approval",
      "approval"
    );

    // 🔴 REQUEST BADGE EVENT (THIS WAS MISSING)
    io.to(`user_${u.user_id}`).emit("newRequest");
  }
};

/* =====================================================
   STUDENT SIDE
===================================================== */

/* ================= FETCH ALL STUDENT REQUESTS ================= */
export const getAllStudentRequests = async (req, res) => {
  const { userId } = req.params;

  try {
    const [studentRows] = await db.query(
      `SELECT id FROM students WHERE user_id = ?`,
      [userId],
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
      [studentId],
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
      [requestId],
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
      [requestId],
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (!["SUBMITTED", "REJECTED"].includes(rows[0].status)) {
      return res.status(403).json({ message: "Cannot update after approval" });
    }

    if (rows[0].request_type === "ON_DUTY") {
      const totalDays =
        Math.ceil(
          (new Date(data.toDate) - new Date(data.fromDate)) /
            (1000 * 60 * 60 * 24),
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
        ],
      );
    } else {
      const totalDays =
        Math.ceil(
          (new Date(data.toDate) - new Date(data.fromDate)) /
            (1000 * 60 * 60 * 24),
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
        ],
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

        s.id AS student_id,
        s.department_id,
        s.year_of_study,

        cs.user_id AS counsellor_user_id,

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
      LEFT JOIN counsellors cs ON cs.id = s.counsellor_id
      LEFT JOIN on_duty_details od ON od.request_id = r.id
      LEFT JOIN gate_pass_details gp ON gp.request_id = r.id
    `;

    let query = "";
    let params = [];

    /* ================= COUNSELLOR ================= */
    if (role === "COUNSELLOR") {
      query = `
        ${baseSelect}
        WHERE r.current_stage = 'COUNSELLOR'
          AND cs.user_id = ?
        ORDER BY r.created_at DESC
      `;
      params = [staffId];
    } else if (role === "COORDINATOR") {
      /* ================= COORDINATOR ================= */
      query = `
    ${baseSelect}
    WHERE
      (
        -- Coordinator-level approval
        r.current_stage = 'COORDINATOR'
        AND EXISTS (
          SELECT 1
          FROM coordinators c
          WHERE c.user_id = ?
            AND c.department_id = s.department_id
            AND c.year = s.year_of_study
        )
      )
      OR
      (
        -- Counsellor-level stage visible to coordinator IF student year matches coordinator year
        r.current_stage = 'COUNSELLOR'
        AND EXISTS (
          SELECT 1
          FROM coordinators c
          WHERE c.user_id = ?
            AND c.year = s.year_of_study
            AND c.id=s.counsellor_id
        )
      )
      OR
      (
        -- Counsellor-stage requests visible IF student.counsellor_id matches coordinator.id
        r.current_stage = 'COUNSELLOR'
        AND EXISTS (
          SELECT 1
          FROM coordinators c
          WHERE c.user_id = ?
            AND c.id = s.counsellor_id
        )
      )
    ORDER BY r.created_at DESC
  `;
      params = [staffId, staffId, staffId];
    } else if (role === "HOD") {
      /* ================= HOD ================= */
      query = `
        ${baseSelect}
        JOIN hods h ON h.user_id = ?
        WHERE r.current_stage = 'HOD'
          AND h.department_id = s.department_id
        ORDER BY r.created_at DESC
      `;
      params = [staffId];
    } else if (role === "WARDEN") {
      /* ================= WARDEN ================= */
      query = `
        ${baseSelect}
        WHERE r.current_stage = 'WARDEN'
        ORDER BY r.created_at DESC
      `;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    const [rows] = await db.query(query, params);

    /* ================= ACTIONABLE FLAG ================= */
    const requests = rows.map((r) => {
      let actionable = false;

      if (role === "COUNSELLOR" && r.current_stage === "COUNSELLOR") {
        actionable = true;
      }

      if (role === "COORDINATOR") {
        if (r.current_stage === "COORDINATOR") actionable = true;

        if (
          r.current_stage === "COUNSELLOR" &&
          r.counsellor_user_id == staffId
        ) {
          actionable = true; // counsellor-level approval
        }
      }

      if (role === "HOD" && r.current_stage === "HOD") actionable = true;
      if (role === "WARDEN" && r.current_stage === "WARDEN") actionable = true;

      return { ...r, actionable };
    });

    res.json({ requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE REQUEST STATUS (APPROVE/REJECT) ================= */

export const updateRequestStatus = async (req, res) => {
  const { requestId } = req.params;
  const { role, action, staffId, rejectionReason } = req.body;

  try {
    // Fetch current request info including student and counsellor
    const [[reqRow]] = await db.query(
      `SELECT 
         r.current_stage, 
         s.year_of_study AS student_year,
         s.counsellor_id,
         cs.user_id AS counsellor_user_id,
         s.department_id
       FROM requests r
       JOIN students s ON r.student_id = s.id
       LEFT JOIN counsellors cs ON cs.id = s.counsellor_id
       WHERE r.id = ?`,
      [requestId],
    );

    if (!reqRow) return res.status(404).json({ message: "Request not found" });

    let nextStage = null;
    let nextStatus = null;

    /* ================= REJECT ================= */
    if (action === "REJECT") {
      await db.query(
        `UPDATE requests
         SET status='REJECTED',
             rejected_by=?,
             rejection_reason=?,
             current_stage='COUNSELLOR'
         WHERE id=?`,
        [role, rejectionReason, requestId],
      );

      return res.json({ message: "Rejected successfully" });
    }

    /* ================= APPROVE ================= */
    if (action === "APPROVE") {
      /* ---------------- COUNSELLOR ---------------- */
      if (role === "COUNSELLOR" && reqRow.current_stage === "COUNSELLOR") {
        nextStage = "COORDINATOR";
        nextStatus = "COUNSELLOR_APPROVED";
      } else if (role === "COORDINATOR") {
        /* ---------------- COORDINATOR ---------------- */
        if (reqRow.current_stage === "COORDINATOR") {
          // Coordinator approving at their own stage
          nextStage = "HOD";
          nextStatus = "COORDINATOR_APPROVED";
        } else if (reqRow.current_stage === "COUNSELLOR") {
          // Coordinator approving a counsellor-stage request
          const [[coord]] = await db.query(
            `SELECT id, year, department_id FROM coordinators WHERE user_id=?`,
            [staffId],
          );

          if (!coord)
            return res
              .status(403)
              .json({ message: "Coordinator info not found" });

          // CASE 1: Coordinator year matches student → skip counsellor approval
          if (coord.year === reqRow.student_year) {
            nextStage = "HOD";
            nextStatus = "COORDINATOR_APPROVED";
          }
          // CASE 2: Coordinator is student’s assigned counsellor → count as COUNSELLOR approval
          else if (
            coord.id === reqRow.counsellor_id &&
            coord.year !== reqRow.student_year
          ) {
            nextStage = "COORDINATOR";
            nextStatus = "COUNSELLOR_APPROVED";
          }
          // CASE 3: Coordinator neither matches year nor assigned counsellor → cannot approve
          else {
            return res
              .status(403)
              .json({ message: "Cannot approve this request" });
          }
        }
      } else if (role === "HOD" && reqRow.current_stage === "HOD") {
        /* ---------------- HOD ---------------- */
        nextStage = "WARDEN";
        nextStatus = "HOD_APPROVED";
      } else if (role === "WARDEN" && reqRow.current_stage === "WARDEN") {
        /* ---------------- WARDEN ---------------- */
        nextStage = "COMPLETED";
        nextStatus = "WARDEN_APPROVED";
      }

      /* ---------------- INVALID ACTION ---------------- */
      if (!nextStage || !nextStatus) {
        return res.status(403).json({ message: "Invalid approval action" });
      }

      await db.query(
        `UPDATE requests
         SET status=?,
             current_stage=?
         WHERE id=?`,
        [nextStatus, nextStage, requestId],
      );
      await notifyNextApprovers(nextStage, reqRow, requestId);

      return res.json({ message: "Approved successfully" });
    }

    res.status(400).json({ message: "Invalid action" });
  } catch (err) {
    console.error("updateRequestStatus:", err);
    res.status(500).json({ message: "Server error" });
  }
};
