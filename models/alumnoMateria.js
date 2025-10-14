export default (sequelize, DataTypes) =>
  sequelize.define("AlumnoMateria", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  });
