import { Usuario } from "../models/index.js";

export const createUsuario = async (req, res) => {
  try {
    const { nombre, usuario, pass, isAdmin } = req.body;
    
    // Validar que los campos requeridos estén presentes
    if (!nombre || !usuario || !pass) {
      return res.status(400).json({ message: "Nombre, usuario y contraseña son requeridos" });
    }

    const nuevoUsuario = await Usuario.create({
      nombre,
      usuario,
      pass,
      isAdmin: isAdmin || false
    });
    
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: "El nombre de usuario ya existe" });
    }
    res.status(500).json({ message: "Error al crear usuario", error: error.message });
  }
};

export const getUsuarios = async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
};

export const getUsuarioById = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
  res.json(usuario);
};

export const updateUsuario = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
  let updateData = { ...req.body };
  if (updateData.pass) {
    const bcrypt = await import('bcrypt');
    updateData.pass = await bcrypt.hash(updateData.pass, 10);
  } else {
    delete updateData.pass; // No modificar si está vacío
  }
  await usuario.update(updateData);
  res.json(usuario);
};

export const deleteUsuario = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
  await usuario.destroy();
  res.json({ message: "Usuario eliminado" });
};