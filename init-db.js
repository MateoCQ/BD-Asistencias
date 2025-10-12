import sequelize from "./db-config.js";
import "./models/index.js";

async function initDB() {
  try {
    await sequelize.sync({ force: false });
    console.log("Base de datos iniciada correctamente");
  } catch (error) {
    console.error("Error al iniciar la base de datos:", error);
  } finally {
    await sequelize.close();
  }
}

initDB();