import bcrypt from "bcryptjs";
import db from "./config/db.js";

const seedUsers = async () => {
  try {
    // Prepare user data
    const users = [
      {
        username: "Admin User",
        register_number: null,
        email: "admin@rmkec.ac.in",
        phone: "9999999999",
        password: "Admin@123",
        role: "ADMIN",
        is_first_login: 1,
        is_active: 1,
      },
      {
        username: "Hosteller Student",
        register_number: "11172220309H",
        email: "hosteller.student@rmkec.ac.in",
        phone: "8888888888",
        password: "Student@123",
        role: "STUDENT",
        is_first_login: 1,
        is_active: 1,
      },
      {
        username: "Dayscholar Student",
        register_number: "11172220309D",
        email: "dayscholar.student@rmkec.ac.in",
        phone: "7777777777",
        password: "Student@123",
        role: "STUDENT",
        is_first_login: 1,
        is_active: 1,
      },
      {
        username: "Counsellor User",
        register_number: null,
        email: "counsellor@rmkec.ac.in",
        phone: "6666666666",
        password: "Counsellor@123",
        role: "COUNSELLOR",
        is_first_login: 1,
        is_active: 1,
      },
    ];

    for (const user of users) {
      const hash = await bcrypt.hash(user.password, 10);

      await db.query(
        `INSERT INTO users 
        (username, register_number, email, phone, password_hash, role, is_first_login, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.username,
          user.register_number,
          user.email,
          user.phone,
          hash,
          user.role,
          user.is_first_login,
          user.is_active,
        ]
      );

      console.log(`✅ ${user.role} inserted successfully`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔑 Password: ${user.password}`);
    }

    console.log("🎉 All users seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error inserting users:", err.message);
    process.exit(1);
  }
};

seedUsers();
