// controllers/notifications/studentNotificationController.js
import db from "../../config/db.js";

export const getStudentNotifications = async (req, res) => {
  const { studentId } = req.params;

  try {
    const [notifications] = await db.query(
      `
      SELECT
        id AS request_id,
        request_type,
        status,
        rejected_by,
        rejection_reason,
        created_at
      FROM requests
      WHERE student_id = ?
      ORDER BY created_at DESC
      `,
      [studentId]
    );

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch student notifications" });
  }
};
