import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();
router.post("/login", login);
router.post("/register", protect, adminOnly, register);
export default router;
