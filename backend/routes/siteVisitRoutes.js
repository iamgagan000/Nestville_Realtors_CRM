import { Router } from "express";

import { protect } from "../middleware/auth.js";
import SiteVisit from "../models/SiteVisit.js";
import { makeCrud } from "../controllers/crudFactory.js";

const router = Router();

// All Site Visit APIs require authentication
router.use(protect);

const crud = makeCrud(SiteVisit, {
  populate: [
    ["contact", "name phone"],
    ["lead", "name phone"],
    ["property", "title project location"],
    ["assignedTo", "name"],
  ],
});

// Get all site visits
// GET /api/site-visits
router.get("/", crud.list);

// Create site visit
// POST /api/site-visits
router.post("/", crud.create);

// Get single site visit
// GET /api/site-visits/:id
router.get("/:id", crud.get);

// Update site visit
// PUT /api/site-visits/:id
router.put("/:id", crud.update);

// Delete site visit
// DELETE /api/site-visits/:id
router.delete("/:id", crud.remove);

export default router;