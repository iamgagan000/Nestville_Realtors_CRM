import express from "express";
import Deal from "../models/Deal.js";
import { makeCrud } from "../controllers/crudFactory.js";

const router = express.Router();

const crud = makeCrud(Deal, {
  populate: [
    "contact",
    "lead",
    "property",
    "assignedTo",
  ],
});

router.get("/", crud.list);
router.get("/:id", crud.get);
router.post("/", crud.create);
router.put("/:id", crud.update);
router.delete("/:id", crud.remove);

export default router;