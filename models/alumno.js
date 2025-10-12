import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define("Alumno", {
    legajo: { 
        type: DataTypes.INTEGER, 
        primaryKey: true 
    },
    nombre: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    codeRFID: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
  });