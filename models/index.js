import sequelize from "../db-config.js";
import { DataTypes } from "sequelize";

import UsuarioModel from "./usuario.js";
import AlumnoModel from "./alumno.js";
import MateriaModel from "./materia.js";
import AsistenciaModel from "./asistencia.js";
import AlumnoMateriaModel from "./alumnoMateria.js";

const Usuario = UsuarioModel(sequelize);
const Alumno = AlumnoModel(sequelize);
const Materia = MateriaModel(sequelize);
const Asistencia = AsistenciaModel(sequelize);
const AlumnoMateria = AlumnoMateriaModel(sequelize, DataTypes);

Usuario.hasMany(Materia, { foreignKey: "idUsuario" });
Materia.belongsTo(Usuario, { foreignKey: "idUsuario" });

Alumno.belongsToMany(Materia, { through: AlumnoMateria, foreignKey: "idAlumno" });
Materia.belongsToMany(Alumno, { through: AlumnoMateria, foreignKey: "idMateria" });

Materia.hasMany(Asistencia, { foreignKey: "idmateria" });
Asistencia.belongsTo(Materia, { foreignKey: "idmateria" });
Alumno.hasMany(Asistencia, { foreignKey: "idalumno" });
Asistencia.belongsTo(Alumno, { foreignKey: "idalumno" });

export { sequelize, Usuario, Alumno, Materia, Asistencia, AlumnoMateria };
