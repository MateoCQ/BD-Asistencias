import express from "express";
import {
  getAlumnos,
  getAlumnoById,
  createAlumno,
  updateAlumno,
  deleteAlumno,
  getMateriasAlumno,
} from "../controllers/alumnoController.js";
import { verifyToken } from "../controllers/authController.js";

const router = express.Router();

router.get("/", verifyToken, getAlumnos);
router.get("/:id", verifyToken, getAlumnoById);
router.post("/", verifyToken, createAlumno);
router.put("/:id", verifyToken, updateAlumno);
router.delete("/:id", verifyToken, deleteAlumno);
router.get("/:id/materias", verifyToken, getMateriasAlumno);

export default router;