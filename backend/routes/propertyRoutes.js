import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { listProperties, createProperty, updateProperty, deleteProperty } from "../controllers/propertyController.js";

const router = Router();
router.use(protect);
router.get("/", listProperties);
router.post("/", createProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);
export default router;
