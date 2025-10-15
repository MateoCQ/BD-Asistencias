import { Usuario } from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET = "clave_super_segura";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Espera formato: Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido o expirado" });
    }
    req.user = decoded;
    next();
  });
};

export const register = async (req, res) => {
  try {
    const { nombre, usuario, pass } = req.body;

    if (!nombre || !usuario || !pass) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const existe = await Usuario.findOne({ where: { usuario } });
    if (existe) {
      return res.status(409).json({ error: "El usuario ya existe" });
    }

    const hashedPass = await bcrypt.hash(pass, 10);

    const nuevoUsuario = await Usuario.create({ nombre, usuario, pass: hashedPass });
    res.status(201).json({ message: "Usuario registrado correctamente", usuario: nuevoUsuario });
  } catch (error) {
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
    }
    res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { usuario, pass } = req.body;

    if (!usuario || !pass) {
      return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
    }

    const user = await Usuario.findOne({ where: { usuario } });
    if (!user) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const validPass = await bcrypt.compare(pass, user.pass);
    if (!validPass) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const token = jwt.sign({ id: user.id, usuario: user.usuario, isAdmin: user.isAdmin }, SECRET, { expiresIn: "2h" });

    res.json({ message: "Login exitoso", token, usuario: user });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
};