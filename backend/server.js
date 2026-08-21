import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { createAdminIfMissing } from "./utils/createAdmin.js";
import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import dealRoutes from "./routes/dealRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import followUpRoutes from "./routes/followUpRoutes.js";
import siteVisitRoutes from "./routes/siteVisitRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

const app = express();
app.use(cors({ origin: [config.clientUrl, config.adminUrl].filter(Boolean), credentials: true }));
app.use(express.json());
app.get("/", (req,res) => res.json({ success:true, message:"EstateCRM API is running" }));
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/follow-ups", followUpRoutes);
app.use("/api/site-visits", siteVisitRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/settings", settingsRoutes);
app.use((err,req,res,next) => { console.error(err); res.status(err.status || 500).json({success:false,message:err.message || "Server error"}); });

async function start() {
  try {
    await connectDB(config.mongoUri);
    await createAdminIfMissing({ name:config.adminName, email:config.adminEmail, password:config.adminPassword });
    app.listen(config.port, () => console.log(`API running on http://localhost:${config.port}`));
  } catch (error) { console.error("Startup failed:", error.message); process.exit(1); }
}
start();
