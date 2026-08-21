import dotenv from "dotenv";
dotenv.config();
export const config = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  adminUrl: process.env.ADMIN_URL || "http://localhost:5174",
  adminName: process.env.ADMIN_NAME || "Nestville Admin",
  adminEmail: (process.env.ADMIN_EMAIL || "admin@estatecrm.com").toLowerCase().trim(),
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
};
