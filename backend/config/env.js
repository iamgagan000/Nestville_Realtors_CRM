import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Server
  port: Number(process.env.PORT || 5000),

  // Database
  mongoUri: process.env.MONGO_URI,

  // Authentication
  jwtSecret: process.env.JWT_SECRET,

  // Frontend URLs
  clientUrl:
    process.env.CLIENT_URL ||
    "https://nestville-realtors-crm-j1eg.vercel.app",

  adminUrl:
    process.env.ADMIN_URL ||
    "https://nestville-realtors-crm-j1eg.vercel.app",

  // Admin account
  adminName:
    process.env.ADMIN_NAME || "Nestville Admin",

  adminEmail:
    (process.env.ADMIN_EMAIL || "admin@estatecrm.com")
      .toLowerCase()
      .trim(),

  adminPassword:
    process.env.ADMIN_PASSWORD || "admin123",
};