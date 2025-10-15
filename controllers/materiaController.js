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

export const createMateria = async (req, res) => {
  try {
    const { nombre, año } = req.body;
    if (!nombre || año === undefined) {
      return res.status(400).json({ error: "Nombre y año son obligatorios" });
    }
    const materia = await Materia.create({ nombre, año });
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