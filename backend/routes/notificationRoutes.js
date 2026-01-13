// notificationRoutes.js
import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
} from "../controllers/notifications/staffNotificationController.js";

const router = express.Router();

// Get notifications for a user
router.get("/:userId", getNotifications);

// Mark single notification as read
router.put("/read/:id", markAsRead);

// Mark all notifications as read
router.put("/read-all/:userId", markAllAsRead);

// Clear all notifications
router.delete("/:userId", clearAllNotifications);

export default router;
