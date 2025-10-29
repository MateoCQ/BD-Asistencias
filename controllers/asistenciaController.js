import { Asistencia, Alumno, Materia } from "../models/index.js";

export const getAsistencias = async (req, res) => {
  try {
    const asistencias = await Asistencia.findAll({ include: [Alumno, Materia] });
    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAsistenciaById = async (req, res) => {
  try {
    const asistencia = await Asistencia.findByPk(req.params.id, { include: [Alumno, Materia] });
    if (!asistencia) return res.status(404).json({ message: "Asistencia no encontrada" });
    res.json(asistencia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAsistencia = async (req, res) => {
  try {
    const { idAlumno, idMateria, state } = req.body;

    if (!idAlumno || !idMateria)
      return res.status(400).json({ error: "idAlumno e idMateria son requeridos" });

    const alumno = await Alumno.findByPk(idAlumno);
    const materia = await Materia.findByPk(idMateria);
    if (!alumno || !materia)
      return res.status(404).json({ error: "Alumno o materia no encontrados" });

    const asistencia = await Asistencia.create({
      fecha: new Date(),
      state: state ?? true,
      idalumno: idAlumno,
      idmateria: idMateria,
    });

    res.status(201).json({ message: "Asistencia registrada", asistencia });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAsistenciasByAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    const asistencias = await Asistencia.findAll({
      where: { idalumno: id },
      include: [Materia],
    });

    if (!asistencias.length)
      return res.status(404).json({ message: "No se encontraron asistencias para este alumno" });

    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAsistenciasByMateria = async (req, res) => {
  try {
    const { id } = req.params;
    const asistencias = await Asistencia.findAll({
      where: { idmateria: id },
      include: [Alumno],
    });
    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAsistencia = async (req, res) => {
  try {
    const asistencia = await Asistencia.findByPk(req.params.id);
    if (!asistencia) return res.status(404).json({ message: "Asistencia no encontrada" });
    await asistencia.update(req.body);
    res.json(asistencia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAsistencia = async (req, res) => {
  try {
    const asistencia = await Asistencia.findByPk(req.params.id);
    if (!asistencia) return res.status(404).json({ message: "Asistencia no encontrada" });
    await asistencia.destroy();
    res.json({ message: "Asistencia eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
