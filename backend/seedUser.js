import bcrypt from "bcryptjs";
import db from "./config/db.js";

const seedUser = async () => {
  try {
    const password = "Test@123";
    const hash = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users 
      (username, email, password_hash, role, is_first_login, is_active)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        "Test Student",
        "test.student@rmkec.ac.in",
        hash,
        "STUDENT",
        0,
        1,
      ]
    );

    console.log("✅ User inserted successfully");
    console.log("📧 Email: test.student@rmkec.ac.in");
    console.log("🔑 Password: Test@123");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error inserting user:", err.message);
    process.exit(1);
  }
};

seedUser();
