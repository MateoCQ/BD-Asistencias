import express from "express";
import {
  getAlumnos,
  getAlumnoById,
  createAlumno,
  updateAlumno,
  deleteAlumno
} from "../controllers/alumnoController.js";

const router = express.Router();

router.get("/", getAlumnos);
router.get("/:id", getAlumnoById);
router.post("/", createAlumno);
router.put("/:id", updateAlumno);
router.delete("/:id", deleteAlumno);

export default router;