import { Usuario } from "../models/index.js";

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
  await usuario.update(req.body);
  res.json(usuario);
};

export const deleteUsuario = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
  await usuario.destroy();
  res.json({ message: "Usuario eliminado" });
};