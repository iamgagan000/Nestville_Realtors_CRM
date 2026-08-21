import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 5000),

  mongoUri: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET,

  clientUrl:
    process.env.CLIENT_URL ||
    "https://nestville-realtors-crm-j1eg.vercel.app",

  adminUrl:
    process.env.ADMIN_URL || "",

  adminName:
    process.env.ADMIN_NAME || "Nestville Admin",

  adminEmail:
    (process.env.ADMIN_EMAIL || "admin@estatecrm.com")
      .toLowerCase()
      .trim(),

  adminPassword:
    process.env.ADMIN_PASSWORD || "admin123",
};