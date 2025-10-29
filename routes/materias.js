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
router.get("/:id", verifyToken, getMateriaById);
router.post("/", verifyToken, createMateria);
router.put("/:id", verifyToken, updateMateria);
router.delete("/:id", verifyToken, deleteMateria);
router.get("/profesor/:id", verifyToken, getMateriasByProfesor);
export default router;