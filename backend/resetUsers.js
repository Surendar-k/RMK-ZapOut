import bcrypt from "bcryptjs";
import db from "./config/db.js";

// 🔹 Users to reset
const usersToReset = [
  { email: "dayscholar.student@rmkec.ac.in", defaultPassword: "Student@123" },
  { email: "counsellor@rmkec.ac.in", defaultPassword: "Counsellor@123" },
];

const resetUsers = async () => {
  try {
    for (const user of usersToReset) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.defaultPassword, salt);

      const [result] = await db.query(
        `UPDATE users
         SET password_hash = ?, is_first_login = 1
         WHERE email = ?`,
        [hashedPassword, user.email]
      );

      if (result.affectedRows === 0) {
        console.log(`User not found or inactive: ${user.email}`);
      } else {
        console.log(`✅ Reset password & first login for: ${user.email}`);
      }
    }

    console.log("All selected users have been reset.");
    process.exit(0);
  } catch (err) {
    console.error("Error resetting users:", err);
    process.exit(1);
  }
};

// Run the script
resetUsers();
