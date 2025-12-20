import { db } from "../config/db.js";

export const findUserByRegisterNumber = (registerNumber) => {
  return db
    .promise()
    .query(
      "SELECT * FROM users WHERE register_number = ? AND is_active = true",
      [registerNumber]
    );
};
