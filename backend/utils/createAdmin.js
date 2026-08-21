import bcrypt from "bcryptjs";
import User from "../models/User.js";

export async function createAdminIfMissing({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) return existing;
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role: "admin" });
  console.log(`Admin account created: ${email}`);
  return user;
}
