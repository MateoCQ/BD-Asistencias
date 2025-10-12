import express from "express";
import {
  getDocentes,
  getDocenteById,
  createDocente,
  updateDocente,
  deleteDocente
} from "../controllers/docenteController.js";

const router = express.Router();

router.get("/", getDocentes);
router.get("/:id", getDocenteById);
router.post("/", createDocente);
router.put("/:id", updateDocente);
router.delete("/:id", deleteDocente);

export default router;