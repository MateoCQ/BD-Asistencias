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

// Endpoint REST para último RFID no registrado (debe estar a nivel de app, no dentro de WS)
app.get("/api/alumnos/ultimo-rfid-no-registrado", (req, res) => {
  if (ultimoRFIDNoRegistrado.codeRFID) {
    res.json(ultimoRFIDNoRegistrado);
  } else {
    res.status(404).json({ message: "No hay RFID no registrado reciente" });
  }
});

const PORT = process.env.PORT || 3000;

// HTTP + WebSocket
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// In-memory deduplication maps to avoid processing rapid duplicate scans
const LAST_SEEN_CARD_MS = 5000; // ignore same card within 5s by default
const LAST_SEEN_ALUMNO_MS = 5000; // ignore same alumno within 5s
const lastSeenByCard = new Map();
const lastSeenByAlumno = new Map();

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

      // Simple server-side dedupe: ignore same card scanned too frequently
      try {
        const now = Date.now();
        const lastCardTs = lastSeenByCard.get(data.card_id);
        if (lastCardTs && (now - lastCardTs) < LAST_SEEN_CARD_MS) {
          console.log(`Ignorando scan duplicado de tarjeta ${data.card_id} (dentro de ${LAST_SEEN_CARD_MS}ms)`);
          return; // skip processing
        }
        lastSeenByCard.set(data.card_id, now);
      } catch (e) {}

      const alumno = await Alumno.findOne({ where: { codeRFID: data.card_id } });

      if (alumno) {
        // ✅ Alumno existente → Asistencia
        console.log("Alumno encontrado:", alumno.nombre);
        // Avoid repeated attendance entries for same alumno in a short window
        try {
          const now = Date.now();
          const key = alumno.legajo ?? alumno.id;
          const lastAlumnoTs = lastSeenByAlumno.get(key);
          if (lastAlumnoTs && (now - lastAlumnoTs) < LAST_SEEN_ALUMNO_MS) {
            console.log(`Ignorando asistencia duplicada para alumno ${key} (dentro de ${LAST_SEEN_ALUMNO_MS}ms)`);
            return;
          }
          lastSeenByAlumno.set(key, now);
        } catch (e) {}
        // Broadcast plain alumno object (no instancia Sequelize) to avoid missing fields on client
        const alumnoPlain = (typeof alumno.get === 'function') ? alumno.get({ plain: true }) : alumno;
        for (const wsFront of asistenciaViews) {
          if (wsFront.readyState === wsFront.OPEN) {
            wsFront.send(JSON.stringify({ type: "new_attendance", alumno: alumnoPlain }));
          }
        }
      } else {
        // ⚠️ Tarjeta nueva → enviar a admins para registro
        console.log("Tarjeta no registrada, enviando a RFID...");
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