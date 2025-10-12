import express from "express";
import {
  getAsistencias,
  getAsistenciaById,
  createAsistencia,
  updateAsistencia,
  deleteAsistencia
} from "../controllers/asistenciaController.js";

const router = express.Router();

router.get("/", getAsistencias);
router.get("/:id", getAsistenciaById);
router.post("/", createAsistencia);
router.put("/:id", updateAsistencia);
router.delete("/:id", deleteAsistencia);

export default router;