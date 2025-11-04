export const getAlumnoByCodeRFID = async (req, res) => {
  try {
    const { codeRFID } = req.params;
    const alumno = await Alumno.findOne({ where: { codeRFID }, include: Materia });
    if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });
    res.json(alumno);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar el alumno", error: error.message });
  }
};
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
  try {
    const { nombre, legajo, codeRFID, materias } = req.body;

    if (!nombre || !legajo || !codeRFID) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const existe = await Alumno.findOne({ where: { codeRFID } });
    if (existe) {
      return res.status(409).json({ message: "Esta tarjeta ya está asignada" });
    }

    const alumno = await Alumno.create({ nombre, legajo, codeRFID });

    // Asignar materias si vienen en el body
    if (Array.isArray(materias) && materias.length > 0) {
      await alumno.setMateria(materias);
    }

    // Devolver el alumno con materias incluidas
    const alumnoCompleto = await Alumno.findByPk(alumno.id, { include: Materia });
    res.status(201).json(alumnoCompleto);
  } catch (error) {
    console.error("Error creando alumno:", error);
    res.status(500).json({ message: "Error al crear el alumno" });
  }
};


export const updateAlumno = async (req, res) => {
  try {
    const alumno = await Alumno.findByPk(req.params.id);
    if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });
    const { materias, ...rest } = req.body;
    await alumno.update(rest);
    // Si vienen materias, actualizar la relación
    if (Array.isArray(materias)) {
      await alumno.setMateria(materias);
    }
    // Devolver el alumno con materias incluidas
    const alumnoCompleto = await Alumno.findByPk(alumno.id, { include: Materia });
    res.json(alumnoCompleto);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el alumno", error: error.message });
  }
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