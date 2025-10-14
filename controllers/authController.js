import { Usuario } from "../models/index.js";

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

    const nuevoUsuario = await Usuario.create({ nombre, usuario, pass });
    res.status(201).json({ message: "Usuario registrado correctamente", usuario: nuevoUsuario });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
    }
    res.status(500).json({ error: "Error interno del servidor" });
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

    if (user.pass !== pass) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    res.json({ message: "Login exitoso", usuario: user });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};