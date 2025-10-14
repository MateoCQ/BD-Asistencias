import express from "express";
import {
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario
} from "../controllers/usuarioController.js";
import { verifyToken } from "../controllers/authController.js";

const router = express.Router();

router.get("/", verifyToken, getUsuarios);
router.get("/:id", verifyToken, getUsuarioById);
router.put("/:id", verifyToken, updateUsuario);
router.delete("/:id", verifyToken, deleteUsuario);

export default router;