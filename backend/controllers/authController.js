import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function tokenFor(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone };
}

export async function register(req, res, next) {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success:false, message:"Name, email and password are required" });
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(409).json({ success:false, message:"Email already registered" });
    const hash = await bcrypt.hash(password, 10);
    const safeRole = ["agent","manager"].includes(role) ? role : "agent";
    const user = await User.create({ name, email: email.toLowerCase().trim(), password:hash, phone, role:safeRole });
    res.status(201).json({ success:true, user:publicUser(user), token:tokenFor(user) });
  } catch (error) { next(error); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({success:false,message:"Email and password are required"});
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ success:false, message:"Invalid email or password" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success:false, message:"Invalid email or password" });
    res.json({ success:true, user:publicUser(user), token:tokenFor(user) });
  } catch (error) { next(error); }
}

export async function ensureAdmin(req, res, next) {
  try {
    const email = (process.env.ADMIN_EMAIL || "admin@estatecrm.com").toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const name = process.env.ADMIN_NAME || "Nestville Admin";
    let user = await User.findOne({email});
    const hash = await bcrypt.hash(password,10);
    if (!user) {
      user = await User.create({name,email,password:hash,role:"admin"});
    } else {
      // Development/setup helper: make sure the configured admin credentials
      // always match the .env values, even if an old admin already exists.
      user.role = "admin";
      user.password = hash;
      user.name = name;
      await user.save();
    }
    res.json({success:true,message:"Admin account is ready",email});
  } catch(error){ next(error); }
}
