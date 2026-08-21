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

/* =========================
   CORS CONFIGURATION
========================= */

const allowedOrigins = [
  "https://nestville-realtors-crm-j1eg.vercel.app",
  config.clientUrl,
  config.adminUrl,

  // Local development
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header
    // (Postman, server-to-server, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("CORS blocked origin:", origin);

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],

  optionsSuccessStatus: 204,
};

/* CORS must come before routes */
app.use(cors(corsOptions));

/* Handle browser preflight requests */
app.options(/.*/, cors(corsOptions));

/* =========================
   BODY PARSER
========================= */

app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EstateCRM API is running",
  });
});

/* =========================
   API ROUTES
========================= */

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

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  if (err.message?.startsWith("CORS blocked origin")) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

/* =========================
   START SERVER
========================= */

async function start() {
  try {
    await connectDB(config.mongoUri);

    await createAdminIfMissing({
      name: config.adminName,
      email: config.adminEmail,
      password: config.adminPassword,
    });

    app.listen(config.port, () => {
      console.log(`API running on port ${config.port}`);
      console.log("Allowed CORS origins:", allowedOrigins);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

start();