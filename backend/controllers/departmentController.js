import db from "../config/db.js";

/* ================= GET ALL ================= */
export const getDepartments = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, display_name FROM departments ORDER BY display_name"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};

/* ================= CREATE ================= */
export const createDepartment = async (req, res) => {
  const { name, display_name } = req.body;

  if (!name || !display_name) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO departments (name, display_name) VALUES (?, ?)",
      [name, display_name]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      display_name,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Department already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Create failed" });
  }
};

/* ================= UPDATE ================= */
export const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, display_name } = req.body;

  try {
    await db.query("UPDATE departments SET name=?, display_name=? WHERE id=?", [
      name,
      display_name,
      id,
    ]);

    res.json({ message: "Department updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

/* ================= DELETE ================= */
export const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM departments WHERE id = ?", [id]);
    res.status(200).json({ message: "Department deleted" });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message:
          "Cannot delete department. It is assigned to students or faculty.",
      });
    }

    console.error("Delete Department Error:", error);
    res.status(500).json({ message: "Failed to delete department" });
  }
};
