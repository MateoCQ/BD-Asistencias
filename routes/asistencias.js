import express from "express";
import {
  getAsistencias,
  getAsistenciaById,
  createAsistencia,
  updateAsistencia,
  deleteAsistencia,
  getAsistenciasByAlumno,
  getAsistenciasByMateria,
} from "../controllers/asistenciaController.js";
import { verifyToken } from "../controllers/authController.js";

const router = express.Router();

router.get("/", verifyToken, getAsistencias);
router.get("/:id", verifyToken, getAsistenciaById);
router.post("/", verifyToken, createAsistencia);
router.put("/:id", verifyToken, updateAsistencia);
router.delete("/:id", verifyToken, deleteAsistencia);
router.get("/alumno/:id", verifyToken, getAsistenciasByAlumno);
router.get("/materia/:id", verifyToken, getAsistenciasByMateria);

export default router;