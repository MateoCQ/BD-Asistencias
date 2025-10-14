import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";

import authRoutes from "./routes/auth.js";
import usuariosRoutes from "./routes/usuarios.js";
import materiasRoutes from "./routes/materias.js";
import alumnosRoutes from "./routes/alumnos.js";
import asistenciasRoutes from "./routes/asistencias.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/materias", materiasRoutes);
app.use("/api/alumnos", alumnosRoutes);
app.use("/api/asistencias", asistenciasRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida");
    await sequelize.sync({ force: false });
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  } catch (error) {
    console.error("Error al iniciar:", error);
  }
}

startServer();