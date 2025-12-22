import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import onDutyRoutes from "./routes/onDutyRoutes.js";
import studentProfileRoutes from "./routes/studentProfileRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/onduty", onDutyRoutes);
app.use("/api/student/profile", studentProfileRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`RMK ZapOut backend running on port ${PORT}`);
});
