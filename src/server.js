import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { xss } from "express-xss-sanitizer";
import rateLimit from "express-rate-limit";
import productRoutes from "./routes/products.routes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/openapi.js";
import prisma from "./config/db.js";

dotenv.config();
const app = express();

// 🌍 Variables de entorno
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";

// -------------------- 🧱 Seguridad y configuración base --------------------
app.set("trust proxy", 1); // Render/Vercel usan proxy inverso
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(xss());
app.use(express.json({ limit: "10kb" }));
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

// 🌐 CORS dinámico
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",");
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS bloqueado: origen no permitido"), false);
  },
  credentials: true,
}));

// ⏱️ Rate limit global (anti-flood)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas peticiones desde esta IP. Intenta más tarde." },
});
app.use("/api", limiter);

// -------------------- 🔗 Rutas --------------------
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/products", productRoutes);

// 🩺 Healthcheck para monitoreo
app.get("/health", (_, res) => res.status(200).json({ status: "ok", env: NODE_ENV }));
app.get("/", (_, res) => {
  res.send(
    "🍕 API de Rapida&Sabrosa está en funcionamiento 🚀<br>Endpoints: /api/products – /api/docs"
  );
});

// -------------------- ⚠️ Manejo de errores --------------------
app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));
app.use((err, req, res, _next) => {
  console.error("⚠️ Error global capturado:", err);
  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor",
  });
});

// -------------------- 🚀 Servidor --------------------
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor (${NODE_ENV}) corriendo en puerto ${PORT}`);
});

// 🧹 Cierre limpio (Render apaga containers después de inactividad)
const shutdown = async () => {
  console.log("🧹 Cerrando servidor y conexión a DB...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("✅ Servidor detenido correctamente");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
