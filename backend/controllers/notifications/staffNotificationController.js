import db from "../../config/db.js";
import { getIO } from "../../config/socket.js";


// Fetch notifications for a user
export const getNotifications = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Mark single notification as read
export const markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("UPDATE notifications SET is_read = 1 WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Mark all notifications as read for a user
export const markAllAsRead = async (req, res) => {
  const { userId } = req.params;
  try {
    await db.query("UPDATE notifications SET is_read = 1 WHERE user_id = ?", [
      userId,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete all notifications for a user
export const clearAllNotifications = async (req, res) => {
  const { userId } = req.params;
  try {
    await db.query("DELETE FROM notifications WHERE user_id = ?", [userId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Helper to send real-time notification
export const sendNotification = async (userId, message, type = "system") => {
  const [result] = await db.query(
    "INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)",
    [userId, message, type]
  );
  const notification = {
    id: result.insertId,
    user_id: userId,
    message,
    type,
    is_read: 0,
    created_at: new Date(),
  };
  const io = getIO();
  io.to(`user_${userId}`).emit("newNotification", notification);
};
