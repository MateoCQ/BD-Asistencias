import express from "express";
import {
  getMaterias,
  getMateriaById,
  createMateria,
  updateMateria,
  deleteMateria
} from "../controllers/materiaController.js";

const router = express.Router();

router.get("/", getMaterias);
router.get("/:id", getMateriaById);
router.post("/", createMateria);
router.put("/:id", updateMateria);
router.delete("/:id", deleteMateria);

export default router;