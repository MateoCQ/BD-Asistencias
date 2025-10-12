import { Docente } from "../models/index.js";

export const getDocentes = async (req, res) => {
  const docentes = await Docente.findAll();
  res.json(docentes);
};

export const getDocenteById = async (req, res) => {
  const docente = await Docente.findByPk(req.params.id);
  if (!docente) return res.status(404).json({ message: "Docente no encontrado" });
  res.json(docente);
};

export const createDocente = async (req, res) => {
  const docente = await Docente.create(req.body);
  res.status(201).json(docente);
};

export const updateDocente = async (req, res) => {
  const docente = await Docente.findByPk(req.params.id);
  if (!docente) return res.status(404).json({ message: "Docente no encontrado" });
  await docente.update(req.body);
  res.json(docente);
};

export const deleteDocente = async (req, res) => {
  const docente = await Docente.findByPk(req.params.id);
  if (!docente) return res.status(404).json({ message: "Docente no encontrado" });
  await docente.destroy();
  res.json({ message: "Docente eliminado" });
};