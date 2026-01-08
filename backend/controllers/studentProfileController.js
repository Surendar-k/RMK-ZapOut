import db from "../config/db.js";

/**
 * GET STUDENT PROFILE
 */
export const getStudentProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const [[row]] = await db.query(
      `
      SELECT 
        u.username,
        u.register_number,
        u.email AS collegeEmail,
        u.personal_email,
        u.phone,
        u.photo,

        s.section,
        s.year_of_study,
        s.student_type,
        s.hostel_name,
        s.room_number,
        s.bus_details,

        s.father_name,
        s.father_mobile,
        s.mother_name,
        s.mother_mobile,
        s.guardian_name,
        s.guardian_mobile,

        d.name AS department,

        /* Counsellor / Coordinator Info */
        COALESCE(cu.username, co_u.username) AS counsellor_name,
        COALESCE(cu.phone, co_u.phone) AS counsellor_mobile,
        COALESCE(cu.role, co_u.role) AS counsellor_role

      FROM users u
      JOIN students s ON s.user_id = u.id
      JOIN departments d ON d.id = s.department_id

      /* Counsellor Join */
      LEFT JOIN counsellors c ON c.id = s.counsellor_id
      LEFT JOIN users cu ON cu.id = c.user_id

      /* Coordinator Join */
      LEFT JOIN coordinators co ON co.id = s.counsellor_id
      LEFT JOIN users co_u ON co_u.id = co.user_id

      WHERE u.id = ?
      `,
      [userId]
    );

    if (!row)
      return res.status(404).json({ message: "Profile not found" });

    res.json(row);
  } catch (err) {
    console.error("Get Student Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * UPDATE STUDENT PROFILE
 */
export const updateStudentProfile = async (req, res) => {
  const { userId } = req.params;
  const d = req.body;

  try {
    // USERS
    await db.query(
      `UPDATE users SET phone = ?, personal_email = ? WHERE id = ?`,
      [d.mobile, d.personalEmail, userId]
    );

    // STUDENTS
    await db.query(
      `UPDATE students SET
        hostel_name = ?,
        room_number = ?,
        bus_details = ?,
        father_name = ?,
        father_mobile = ?,
        mother_name = ?,
        mother_mobile = ?,
        guardian_name = ?,
        guardian_mobile = ?
       WHERE user_id = ?`,
      [
        d.hostel || null,
        d.room || null,
        d.bus || null,
        d.fatherName || null,
        d.fatherMobile || null,
        d.motherName || null,
        d.motherMobile || null,
        d.guardianName || null,
        d.guardianMobile || null,
        userId,
      ]
    );

    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};