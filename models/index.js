import sequelize from "../db-config.js";
import DocenteModel from "./docente.js";
import MateriaModel from "./materia.js";
import AlumnoModel from "./alumno.js";
import AsistenciaModel from "./asistencia.js";

const Docente = DocenteModel(sequelize);
const Materia = MateriaModel(sequelize);
const Alumno = AlumnoModel(sequelize);
const Asistencia = AsistenciaModel(sequelize);

Docente.hasMany(Materia, { foreignKey: "idDocente" });
Materia.belongsTo(Docente, { foreignKey: "idDocente" });

Materia.hasMany(Alumno, { foreignKey: "idmateria" });
Alumno.belongsTo(Materia, { foreignKey: "idmateria" });

Materia.hasMany(Asistencia, { foreignKey: "idmateria" });
Asistencia.belongsTo(Materia, { foreignKey: "idmateria" });

Alumno.hasMany(Asistencia, { foreignKey: "idalumno" });
Asistencia.belongsTo(Alumno, { foreignKey: "idalumno" });

export { sequelize, Docente, Materia, Alumno, Asistencia };