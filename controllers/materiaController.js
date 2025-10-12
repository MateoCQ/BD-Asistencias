import { Materia, Docente } from "../models/index.js";

export const getMaterias = async (req, res) => {
  const materias = await Materia.findAll({ include: Docente });
  res.json(materias);
};

export const getMateriaById = async (req, res) => {
  const materia = await Materia.findByPk(req.params.id, { include: Docente });
  if (!materia) return res.status(404).json({ message: "Materia no encontrada" });
  res.json(materia);
};

export const createMateria = async (req, res) => {
  const materia = await Materia.create(req.body);
  res.status(201).json(materia);
};

export const updateMateria = async (req, res) => {
  const materia = await Materia.findByPk(req.params.id);
  if (!materia) return res.status(404).json({ message: "Materia no encontrada" });
  await materia.update(req.body);
  res.json(materia);
};

export const deleteMateria = async (req, res) => {
  const materia = await Materia.findByPk(req.params.id);
  if (!materia) return res.status(404).json({ message: "Materia no encontrada" });
  await materia.destroy();
  res.json({ message: "Materia eliminada" });
};