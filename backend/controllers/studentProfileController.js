import db from "../config/db.js";

/**
 * GET STUDENT PROFILE
 */
export const getStudentProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        u.id,
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
        c.cabin_number,
        cu.username AS counsellor_name,
        cu.phone AS counsellor_mobile
      FROM users u
      JOIN students s ON s.user_id = u.id
      JOIN departments d ON d.id = s.department_id
      LEFT JOIN counsellors c ON c.id = s.counsellor_id
      LEFT JOIN users cu ON cu.id = c.user_id
      WHERE u.id = ?
      `,
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

/**
 * UPDATE STUDENT PROFILE
 */
export const updateStudentProfile = async (req, res) => {
  const { userId } = req.params;
  const data = req.body;

  try {
    await db.query(
      `
      UPDATE users SET
        personal_email = ?,
        phone = ?
      WHERE id = ?
      `,
      [data.personalEmail, data.mobile, userId]
    );

    await db.query(
      `
      UPDATE students SET
        section = ?,
        student_type = ?,
        hostel_name = ?,
        room_number = ?,
        bus_details = ?,
        father_name = ?,
        father_mobile = ?,
        mother_name = ?,
        mother_mobile = ?,
        guardian_name = ?,
        guardian_mobile = ?
      WHERE user_id = ?
      `,
      [
        data.section,
        data.type,
        data.hostel || null,
        data.room || null,
        data.bus || null,
        data.fatherName,
        data.fatherMobile,
        data.motherName,
        data.motherMobile,
        data.guardianName,
        data.guardianMobile,
        userId,
      ]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};
