import db from "./config/db.js";
import bcrypt from "bcryptjs";

const seedData = async () => {
  try {
    console.log("🌱 Seeding database...");

    /* =============================
       1️⃣ DEPARTMENTS
    ============================== */
    const departments = ["CSE", "IT", "ECE", "EEE", "MECH"];

    for (const dept of departments) {
      await db.query(
        "INSERT IGNORE INTO departments (name) VALUES (?)",
        [dept]
      );
    }

    const [[itDept]] = await db.query(
      "SELECT id FROM departments WHERE name = 'IT'"
    );

    console.log("✅ Departments seeded");

    /* =============================
       2️⃣ USERS
    ============================== */
    const password = await bcrypt.hash("Test@123", 10);

    const users = [
      {
        username: "Hosteller Student",
        email: "hosteller.student@rmkec.ac.in",
        role: "STUDENT",
        student_type: "HOSTELLER",
      },
      {
        username: "Dayscholar Student",
        email: "dayscholar.student@rmkec.ac.in",
        role: "STUDENT",
        student_type: "DAYSCHOLAR",
      },
      {
        username: "Dr Kumar",
        email: "counsellor@rmkec.ac.in",
        role: "COUNSELLOR",
        student_type: "COUNSELLOR",
      },
      {
        username: "Mr Coordinator",
        email: "coordinator@rmkec.ac.in",
        role: "COORDINATOR",
        student_type: "COORDINATOR",
      },
      {
        username: "Dr HOD",
        email: "hod@rmkec.ac.in",
        role: "HOD",
        student_type: "HOD",
      },
      {
        username: "Mr Warden",
        email: "warden@rmkec.ac.in",
        role: "WARDEN",
        student_type: null,
      },
    ];

    for (const u of users) {
      await db.query(
        `INSERT IGNORE INTO users
         (username, email, password_hash, role, student_type)
         VALUES (?, ?, ?, ?, ?)`,
        [u.username, u.email, password, u.role, u.student_type]
      );
    }

    console.log("✅ Users seeded");

    /* =============================
       3️⃣ FETCH USER IDS
    ============================== */
    const [[hostellerUser]] = await db.query(
      "SELECT id FROM users WHERE email='hosteller.student@rmkec.ac.in'"
    );
    const [[dayscholarUser]] = await db.query(
      "SELECT id FROM users WHERE email='dayscholar.student@rmkec.ac.in'"
    );
    const [[counsellorUser]] = await db.query(
      "SELECT id FROM users WHERE email='counsellor@rmkec.ac.in'"
    );
    const [[coordinatorUser]] = await db.query(
      "SELECT id FROM users WHERE email='coordinator@rmkec.ac.in'"
    );
    const [[hodUser]] = await db.query(
      "SELECT id FROM users WHERE email='hod@rmkec.ac.in'"
    );
    const [[wardenUser]] = await db.query(
      "SELECT id FROM users WHERE email='warden@rmkec.ac.in'"
    );

    /* =============================
       4️⃣ COUNSELLOR
    ============================== */
    const [counsellorRes] = await db.query(
      `INSERT IGNORE INTO counsellors
       (user_id, department_id, cabin_number)
       VALUES (?, ?, ?)`,
      [counsellorUser.id, itDept.id, "C-102"]
    );

    const counsellorId =
      counsellorRes.insertId ||
      (
        await db.query(
          "SELECT id FROM counsellors WHERE user_id=?",
          [counsellorUser.id]
        )
      )[0][0].id;

    console.log("✅ Counsellor seeded");

    /* =============================
       5️⃣ COORDINATOR, HOD, WARDEN
    ============================== */
    await db.query(
      `INSERT IGNORE INTO coordinators (user_id, department_id)
       VALUES (?, ?)`,
      [coordinatorUser.id, itDept.id]
    );

    await db.query(
      `INSERT IGNORE INTO hods (user_id, department_id)
       VALUES (?, ?)`,
      [hodUser.id, itDept.id]
    );

    await db.query(
      `INSERT IGNORE INTO wardens (user_id, hostel_name)
       VALUES (?, ?)`,
      [wardenUser.id, "Boys Hostel A"]
    );

    console.log("✅ Coordinator, HOD, Warden seeded");

    /* =============================
       6️⃣ STUDENTS
    ============================== */
    const [hostellerStudent] = await db.query(
      `INSERT IGNORE INTO students
      (user_id, department_id, year_of_study, counsellor_id,
       hostel_name, room_number, student_type, section)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        hostellerUser.id,
        itDept.id,
        3,
        counsellorId,
        "Boys Hostel A",
        "A-212",
        "HOSTELLER",
        "A",
      ]
    );

    const hostellerStudentId =
      hostellerStudent.insertId ||
      (
        await db.query(
          "SELECT id FROM students WHERE user_id=?",
          [hostellerUser.id]
        )
      )[0][0].id;

    await db.query(
      `INSERT IGNORE INTO students
      (user_id, department_id, year_of_study, counsellor_id,
       student_type, bus_details, section)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        dayscholarUser.id,
        itDept.id,
        3,
        counsellorId,
        "DAYSCHOLAR",
        "Route 23",
        "A",
      ]
    );

    console.log("✅ Students seeded");

    /* =============================
       7️⃣ ON DUTY REQUEST
    ============================== */
    const [odReq] = await db.query(
      `INSERT INTO requests (student_id, request_type)
       VALUES (?, 'ON_DUTY')`,
      [hostellerStudentId]
    );

    await db.query(
      `INSERT INTO on_duty_details
      (request_id, event_type, event_name, college, location,
       from_date, to_date, total_days, proof_file)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        odReq.insertId,
        "Workshop",
        "AI & ML Bootcamp",
        "IIT Madras",
        "Chennai",
        "2025-01-10",
        "2025-01-12",
        3,
        "proof_ai.pdf",
      ]
    );

    console.log("✅ ON DUTY request seeded");

    /* =============================
       8️⃣ GATE PASS REQUEST
    ============================== */
    const [gpReq] = await db.query(
      `INSERT INTO requests (student_id, request_type)
       VALUES (?, 'GATE_PASS')`,
      [hostellerStudentId]
    );

    await db.query(
      `INSERT INTO gate_pass_details
      (request_id, reason, out_time, in_time,
       from_date, to_date, total_days)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        gpReq.insertId,
        "Family Visit",
        "09:00:00",
        "18:00:00",
        "2025-01-20",
        "2025-01-20",
        1,
      ]
    );

    console.log("✅ Gate pass request seeded");

    console.log("🎉 ALL DATA SEEDED SUCCESSFULLY!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedData();