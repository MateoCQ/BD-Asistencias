import express from "express";
import cors from "cors";
import { sequelize, Alumno } from "./models/index.js"; // 👈 importa Alumno
import http from "http";
import { WebSocketServer } from "ws";

import authRoutes from "./routes/auth.js";

// Variable global para último RFID no registrado
let ultimoRFIDNoRegistrado = { codeRFID: null, timestamp: null };
import usuariosRoutes from "./routes/usuarios.js";
import materiasRoutes from "./routes/materias.js";
import alumnosRoutes from "./routes/alumnos.js";
import asistenciasRoutes from "./routes/asistencias.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rutas REST
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/materias", materiasRoutes);
app.use("/api/alumnos", alumnosRoutes);
app.use("/api/asistencias", asistenciasRoutes);

const PORT = process.env.PORT || 3000;

// HTTP + WebSocket
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Sets de clientes conectados
const registrationAdmins = new Set(); // admins en página de registro
const asistenciaViews = new Set();    // pantallas de asistencia

wss.on("connection", (ws) => {
  console.log("Nuevo cliente conectado");

  // La asignación debe ir dentro del bloque de tarjeta no registrada, no aquí
  ws.on("message", async (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch {
      data = message.toString().trim();
    }

    // --- 1️⃣ ESCANEO DE TARJETA DESDE ESP32 ---
    if (typeof data === "object" && data.type === "esp32_scan" && data.card_id) {
      console.log(`Scan recibido: ${data.card_id}`);

      const alumno = await Alumno.findOne({ where: { codeRFID: data.card_id } });

      if (alumno) {
        // ✅ Alumno existente → Asistencia
        console.log("Alumno encontrado:", alumno.nombre);
        for (const wsFront of asistenciaViews) {
          if (wsFront.readyState === wsFront.OPEN) {
            wsFront.send(JSON.stringify({ type: "new_attendance", alumno }));
          }
        }
      } else {
        // ⚠️ Tarjeta nueva → enviar a admins para registro
        console.log("Tarjeta no registrada, enviando a admins...");
        // Guardar en variable global SOLO si data existe y es una tarjeta no registrada
        ultimoRFIDNoRegistrado = { codeRFID: data.card_id, timestamp: Date.now() };
        for (const admin of registrationAdmins) {
          if (admin.readyState === admin.OPEN) {
            admin.send(
              JSON.stringify({ type: "new_card_scan", card_id: data.card_id })
            );
          }
        }
      }
    }

    // --- 2️⃣ SUSCRIPCIÓN DESDE FRONTEND ---
    if (typeof data === "object" && data.type === "browser_subscribe_registration") {
      registrationAdmins.add(ws);
      ws.isRegistration = true;

// Endpoint REST para último RFID no registrado
app.get("/api/alumnos/ultimo-rfid-no-registrado", (req, res) => {
  if (ultimoRFIDNoRegistrado.codeRFID) {
    res.json(ultimoRFIDNoRegistrado);
  } else {
    res.status(404).json({ message: "No hay RFID no registrado reciente" });
  }
});
      console.log("Admin suscripto al registro.");
    }

    if (typeof data === "object" && data.type === "browser_subscribe_asistencia") {
      asistenciaViews.add(ws);
      ws.isAsistencia = true;
      console.log("Vista de asistencia suscripta.");
    }
  });

  ws.on("close", () => {
    if (ws.isRegistration) registrationAdmins.delete(ws);
    if (ws.isAsistencia) asistenciaViews.delete(ws);
    console.log("Cliente desconectado");
  });

  ws.send("Conexión WS establecida con backend");
});

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log("Base de datos sincronizada correctamente");
    server.listen(PORT, () =>
      console.log(`Servidor Express + WS corriendo en puerto ${PORT}`)
    );
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
}

startServer();