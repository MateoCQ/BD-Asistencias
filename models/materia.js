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
  });