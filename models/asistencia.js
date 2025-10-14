    import { DataTypes } from "sequelize";

    export default (sequelize) =>
    sequelize.define("Asistencia", {
        id: { 
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },
        fecha: { 
            type: DataTypes.DATEONLY, 
            allowNull: false },
        state: { 
            type: DataTypes.BOOLEAN, 
            allowNull: false },
    });