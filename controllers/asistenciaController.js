import { Asistencia, Alumno, Materia } from "../models/index.js";

export const getAsistencias = async (req, res) => {
  const asistencias = await Asistencia.findAll({ include: [Alumno, Materia] });
  res.json(asistencias);
};

export const getAsistenciaById = async (req, res) => {
  const asistencia = await Asistencia.findByPk(req.params.id, { include: [Alumno, Materia] });
  if (!asistencia) return res.status(404).json({ message: "Asistencia no encontrada" });
  res.json(asistencia);
};

export const createAsistencia = async (req, res) => {
  const asistencia = await Asistencia.create(req.body);
  res.status(201).json(asistencia);
};

export const updateAsistencia = async (req, res) => {
  const asistencia = await Asistencia.findByPk(req.params.id);
  if (!asistencia) return res.status(404).json({ message: "Asistencia no encontrada" });
  await asistencia.update(req.body);
  res.json(asistencia);
};

export const deleteAsistencia = async (req, res) => {
  const asistencia = await Asistencia.findByPk(req.params.id);
  if (!asistencia) return res.status(404).json({ message: "Asistencia no encontrada" });
  await asistencia.destroy();
  res.json({ message: "Asistencia eliminada" });
};
