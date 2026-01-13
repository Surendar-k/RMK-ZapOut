import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import onDutyRoutes from "./routes/onDutyRoutes.js";
import studentProfileRoutes from "./routes/studentProfileRoutes.js";
import gatepassRoutes from "./routes/gatepassRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import staffProfileRoutes from "./routes/staffProfileRoutes.js";
import adminStaffRoutes from "./routes/adminRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import adminStudentRoutes from "./routes/adminStudentRoutes.js";
import staffStudentRoutes from "./routes/staffstudentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api", adminStaffRoutes);
app.use("/api/admin", adminStudentRoutes);
app.use("/api/staff", staffStudentRoutes);
app.use("/api/onduty", onDutyRoutes);
app.use("/api/gatepass", gatepassRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/student/profile", studentProfileRoutes);
app.use("/api/staff/profile", staffProfileRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/notifications", notificationRoutes);

// --- HTTP + Socket.io Setup ---
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

// Socket.io server
export const io = new Server(httpServer, {
  cors: { origin: "*" },
});

// Track connected users
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join user-specific room
  socket.on("joinRoom", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`RMK ZapOut backend running on port ${PORT}`);
});
