import { Materia } from "../models/index.js";

export const getMaterias = async (req, res) => {
  try {
    const materias = await Materia.findAll();
    res.json(materias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMateriaById = async (req, res) => {
  try {
    const materia = await Materia.findByPk(req.params.id);
    if (!materia) return res.status(404).json({ message: "Materia no encontrada" });
    res.json(materia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMateriasByProfesor = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const materias = await Materia.findAll({ where: { idUsuario } });
    res.json(materias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMateria = async (req, res) => {
  try {
    const { nombre, año, idUsuario } = req.body;
    if (!nombre || año === undefined || !idUsuario) {
      return res.status(400).json({ error: "Nombre, año e idUsuario son obligatorios" });
    }

    const profesor = await Usuario.findByPk(idUsuario);
    if (!profesor) return res.status(404).json({ error: "Profesor no encontrado" });

    const materia = await Materia.create({ nombre, año, idUsuario });
    res.status(201).json(materia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMateria = async (req, res) => {
  try {
    const { nombre, año } = req.body;
    const materia = await Materia.findByPk(req.params.id);
    if (!materia) return res.status(404).json({ message: "Materia no encontrada" });
    await materia.update({ nombre, año });
    res.json(materia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMateria = async (req, res) => {
  try {
    const materia = await Materia.findByPk(req.params.id);
    if (!materia) return res.status(404).json({ message: "Materia no encontrada" });
    await materia.destroy();
    res.json({ message: "Materia eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};