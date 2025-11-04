import express from "express";
import {
  getMaterias,
  getMateriaById,
  createMateria,
  updateMateria,
  deleteMateria,
  getMateriasByProfesor
} from "../controllers/materiaController.js";
import { verifyToken } from "../controllers/authController.js";

const router = express.Router();

router.get("/", verifyToken, getMaterias);
// IMPORTANT: place parametric routes after fixed prefixes to avoid shadowing
router.get("/profesor/:id", verifyToken, getMateriasByProfesor);
router.get("/:id", verifyToken, getMateriaById);
router.post("/", verifyToken, createMateria);
router.put("/:id", verifyToken, updateMateria);
router.delete("/:id", verifyToken, deleteMateria);
export default router;