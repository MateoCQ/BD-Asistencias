import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define("Materia", {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    nombre: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    año: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
  // Foreign key to Usuario (profesor)
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // keep nullable to avoid breaking existing rows; controller validates on create
  },
  });