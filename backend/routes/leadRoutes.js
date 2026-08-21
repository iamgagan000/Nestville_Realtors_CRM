import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { listLeads, createLead, getLead, updateLead, deleteLead } from "../controllers/leadController.js";

const router = Router();
router.use(protect);
router.get("/", listLeads);
router.post("/", createLead);
router.get("/:id", getLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);
export default router;
