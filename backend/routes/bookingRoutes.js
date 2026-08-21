import { Router } from "express";

import { protect } from "../middleware/auth.js";
import Booking from "../models/Booking.js";
import { makeCrud } from "../controllers/crudFactory.js";

const router = Router();

router.use(protect);

const crud = makeCrud(Booking, {
  populate: [
    ["customer", "name phone"],
    ["property", "title project location"],
    ["deal", "title"],
    ["assignedTo", "name"],
  ],
});

router.get("/", crud.list);

router.post("/", crud.create);

router.get("/:id", crud.get);

router.put("/:id", crud.update);

router.delete("/:id", crud.remove);

export default router;