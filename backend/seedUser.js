import bcrypt from "bcryptjs";
import db from "./config/db.js";

const seedUsers = async () => {
  try {
    console.log("🌱 Seeding ADMIN user only...");

    const adminUser = {
      username: "Admin User",
      register_number: null,
      email: "admin@rmkec.ac.in",
      phone: "9999999999",
      password: "Admin@123",
      role: "ADMIN",
      student_type: "ADMIN",
    };

    const hash = await bcrypt.hash(adminUser.password, 10);

    await db.query(
      `INSERT INTO users
       (username, register_number, email, phone, password_hash, role, student_type, is_first_login, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)`,
      [
        adminUser.username,
        adminUser.register_number,
        adminUser.email.toLowerCase(), // IMPORTANT
        adminUser.phone,
        hash,
        adminUser.role,
        adminUser.student_type,
      ]
    );

    console.log("✅ ADMIN user created successfully");
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔑 Password: ${adminUser.password}`);
    console.log("🎯 First login = password reset required");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error inserting admin user:", err.message);
    process.exit(1);
  }
};

seedUsers();
