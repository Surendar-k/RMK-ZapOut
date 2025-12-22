import bcrypt from "bcryptjs";
import db from "./config/db.js";

const seedUsers = async () => {
  try {
    const users = [
      {
        username: "Admin User",
        register_number: null,
        email: "admin@rmkec.ac.in",
        phone: "9999999999",
        password: "Admin@123",
        role: "ADMIN",
        student_type: "ADMIN",
      },
      {
        username: "Hosteller Student",
        register_number: "11172220309H",
        email: "hosteller.student@rmkec.ac.in",
        phone: "8888888888",
        password: "Student@123",
        role: "STUDENT",
        student_type: "HOSTELLER",
      },
      {
        username: "Dayscholar Student",
        register_number: "11172220309D",
        email: "dayscholar.student@rmkec.ac.in",
        phone: "7777777777",
        password: "Student@123",
        role: "STUDENT",
        student_type: "DAYSCHOLAR",
      },
      {
        username: "Counsellor User",
        register_number: null,
        email: "counsellor@rmkec.ac.in",
        phone: "6666666666",
        password: "Counsellor@123",
        role: "COUNSELLOR",
        student_type: "COUNSELLOR",
      },
       {
        username: "Coordinator User",
        register_number: null,
        email: "coordinator@rmkec.ac.in",
        phone: "4444444444",
        password: "Coordinator@123",
        role: "COORDINATOR",
        student_type: "COORDINATOR",
      },
       {
        username: "Hod User",
        register_number: null,
        email: "hod@rmkec.ac.in",
        phone: "3333333333",
        password: "Hod@123",
        role: "HOD",
        student_type: "HOD",
      },

    ];

    for (const user of users) {
      const hash = await bcrypt.hash(user.password, 10);

      await db.query(
        `INSERT INTO users 
        (username, register_number, email, phone, password_hash, role, student_type, is_first_login, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)`,
        [
          user.username,
          user.register_number,
          user.email,
          user.phone,
          hash,
          user.role,
          user.student_type,
        ]
      );

      console.log(`✅ ${user.role} inserted successfully`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔑 Password: ${user.password}`);
      console.log("──────────────────────────────");
    }

    console.log("🎉 All users seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error inserting users:", err.message);
    process.exit(1);
  }
};

seedUsers();
