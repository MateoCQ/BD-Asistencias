import { Alumno, Materia } from "../models/index.js";

export const getAlumnos = async (req, res) => {
  const alumnos = await Alumno.findAll({ include: Materia });
  res.json(alumnos);
};

export const getAlumnoById = async (req, res) => {
  const alumno = await Alumno.findByPk(req.params.id, { include: Materia });
  if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });
  res.json(alumno);
};

export const createAlumno = async (req, res) => {
  const alumno = await Alumno.create(req.body);
  res.status(201).json(alumno);
};

export const updateAlumno = async (req, res) => {
  const alumno = await Alumno.findByPk(req.params.id);
  if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });
  await alumno.update(req.body);
  res.json(alumno);
};

export const deleteAlumno = async (req, res) => {
  const alumno = await Alumno.findByPk(req.params.id);
  if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });
  await alumno.destroy();
  res.json({ message: "Alumno eliminado" });
};

export const getMateriasAlumno = async (req, res) => {
  try {
    const { idAlumno } = req.params;
    const alumno = await Alumno.findByPk(idAlumno, { include: Materia });
    if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });
    res.json(alumno.Materia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};