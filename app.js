import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";

//Nuevos imports para WebSocket
import http from "http";
import { WebSocketServer } from "ws";

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

const server = http.createServer(app); 
const wss = new WebSocketServer({ server }); 
const clients = new Set();

wss.on("connection", (ws) => {
  console.log("Nuevo cliente conectado (Frontend o ESP32)");
  clients.add(ws);

  ws.on("message", (message) => {
    const tagID = message.toString();
    console.log(`Recibido del ESP32: ${tagID}`);

    clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) { 
        client.send(tagID);
      }
    });
  });

  ws.on("close", () => {
    console.log("Cliente desconectado");
    clients.delete(ws);
  });

  ws.send("Conexión con el servidor backend establecida");
});


async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida");
    await sequelize.sync({ force: false });
    server.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  } catch (error) {
    console.error("Error al iniciar:", error);
  }
}

startServer();