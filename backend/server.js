import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import onDutyRoutes from "./routes/onDutyRoutes.js";
import studentProfileRoutes from "./routes/studentProfileRoutes.js";
import gatepassRoutes from "./routes/gatepassRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import staffProfileRoutes from "./routes/staffProfileRoutes.js";
import adminStaffRoutes from "./routes/adminRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
//user management
app.use("/api/user", userRoutes);
app.use("/api", adminStaffRoutes);

//forms
app.use("/api/onduty", onDutyRoutes);
app.use("/api/gatepass", gatepassRoutes);
app.use("/api/requests", requestRoutes);

//profiles
app.use("/api/student/profile", studentProfileRoutes);
app.use("/api/staff/profile", staffProfileRoutes);

//departments
app.use("/api/departments", departmentRoutes);
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`RMK ZapOut backend running on port ${PORT}`);
});
