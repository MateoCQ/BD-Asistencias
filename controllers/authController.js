import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Usuario } from "../models/index.js";

const SECRET = "clave_super_segura";

export const register = async (req, res) => {
  try {
    const { nombre, usuario, pass, isAdmin } = req.body;
    const hashed = await bcrypt.hash(pass, 10);
    const nuevo = await Usuario.create({ nombre, usuario, pass: hashed, isAdmin });
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ message: "Error al registrar", error });
  }
};

export const login = async (req, res) => {
  try {
    const { usuario, pass } = req.body;
    const user = await Usuario.findOne({ where: { usuario } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const valid = await bcrypt.compare(pass, user.pass);
    if (!valid) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token requerido" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: "Token inválido" });
  }
};