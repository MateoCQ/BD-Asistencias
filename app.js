import express from "express";
import cors from "cors";
import sequelize from "./db-config.js";

import docentesRoutes from "./routes/docentes.js";
import materiasRoutes from "./routes/materias.js";
import alumnosRoutes from "./routes/alumnos.js";
import asistenciasRoutes from "./routes/asistencias.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/docentes", docentesRoutes);
app.use("/api/materias", materiasRoutes);
app.use("/api/alumnos", alumnosRoutes);
app.use("/api/asistencias", asistenciasRoutes);

const PORT = process.env.PORT || 3000;
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a SQLite establecida');
    
    await sequelize.sync({ force: false });
  
    
  } catch (error) {
    console.error('Error al iniciar:', error);
  }
  app.listen(PORT);
}

startServer();