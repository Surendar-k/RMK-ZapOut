import db from "./config/db.js";

const seedData = async () => {
  try {
    console.log("🌱 Seeding other tables...");

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

    console.log("✅ Departments seeded");

    /* =============================
       2️⃣ FETCH REQUIRED IDS
    ============================== */
    const [[itDept]] = await db.query(
      "SELECT id FROM departments WHERE name = 'IT'"
    );

    const [[studentUser]] = await db.query(
      "SELECT id FROM users WHERE email = 'hosteller.student@rmkec.ac.in'"
    );

    const [[dayscholarUser]] = await db.query(
      "SELECT id FROM users WHERE email = 'dayscholar.student@rmkec.ac.in'"
    );

    const [[counsellorUser]] = await db.query(
      "SELECT id FROM users WHERE email = 'counsellor@rmkec.ac.in'"
    );

    const [[coordinatorUser]] = await db.query(
      "SELECT id FROM users WHERE email = 'coordinator@rmkec.ac.in'"
    );

    const [[hodUser]] = await db.query(
      "SELECT id FROM users WHERE email = 'hod@rmkec.ac.in'"
    );

    /* =============================
       3️⃣ COUNSELLOR
    ============================== */
    const [counsellorResult] = await db.query(
      `INSERT INTO counsellors (user_id, department_id, cabin_number)
       VALUES (?, ?, ?)`,
      [counsellorUser.id, itDept.id, "C-102"]
    );

    const counsellorId = counsellorResult.insertId;

    console.log("✅ Counsellor seeded");

    /* =============================
       4️⃣ COORDINATOR
    ============================== */
    await db.query(
      `INSERT INTO coordinators (user_id, department_id)
       VALUES (?, ?)`,
      [coordinatorUser.id, itDept.id]
    );

    console.log("✅ Coordinator seeded");

    /* =============================
       5️⃣ HOD
    ============================== */
    await db.query(
      `INSERT INTO hods (user_id, department_id)
       VALUES (?, ?)`,
      [hodUser.id, itDept.id]
    );

    console.log("✅ HOD seeded");

    /* =============================
       6️⃣ STUDENTS
    ============================== */
    const [hostellerResult] = await db.query(
      `INSERT INTO students 
      (user_id, department_id, year_of_study, dob, address,
       permanent_address, guardian_name, guardian_address,
       counsellor_id, hostel_name, room_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        studentUser.id,
        itDept.id,
        3,
        "2003-05-10",
        "RMKEC Hostel",
        "Chennai",
        "Ramesh Kumar",
        "Chennai",
        counsellorId,
        "Boys Hostel A",
        "A-212",
      ]
    );

    await db.query(
      `INSERT INTO students 
      (user_id, department_id, year_of_study, dob, address,
       permanent_address, guardian_name, guardian_address,
       counsellor_id, hostel_name, room_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dayscholarUser.id,
        itDept.id,
        3,
        "2003-07-22",
        "Avadi",
        "Avadi",
        "Suresh Kumar",
        "Avadi",
        counsellorId,
        null,
        null,
      ]
    );

    console.log("✅ Students seeded");

    /* =============================
       7️⃣ REQUESTS
    ============================== */
    const studentId = hostellerResult.insertId;

    const [requestResult] = await db.query(
      `INSERT INTO requests
      (student_id, request_type, from_date, to_date, total_days)
      VALUES (?, 'ON_DUTY', '2025-01-10', '2025-01-12', 3)`,
      [studentId]
    );

    console.log("✅ Request seeded");

    /* =============================
       8️⃣ ON DUTY DETAILS
    ============================== */
    await db.query(
      `INSERT INTO on_duty_details
      (request_id, event_type, event_name, college, location, proof_file)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        requestResult.insertId,
        "Workshop",
        "AI & ML Bootcamp",
        "IIT Madras",
        "Chennai",
        "proof_ai_workshop.pdf",
      ]
    );

    console.log("✅ On-duty details seeded");

    console.log("🎉 ALL DATA SEEDED SUCCESSFULLY!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedData();