import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { xss } from "express-xss-sanitizer";
import rateLimit from "express-rate-limit";
import productRoutes from "./routes/products.routes.js";
import promotionRoutes from "./routes/promotion.routes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/openapi.js";
import prisma from "./config/db.js";
import { checkPromotionsExpiration } from "./utils/checkPromotionsExpiration.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// -------------------- 🧱 Config base --------------------
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";

// 🔧 Resolver __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- 🛡 Seguridad --------------------
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(xss());
app.use(express.json({ limit: "10kb" }));
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

// -------------------- 🌐 CORS --------------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://rapidaysabrosa-ecommerce-tlru.vercel.app", // 👈 tu dominio de producción
  "https://rapidaysabrosa-api.onrender.com",           // por si el backend se llama a sí mismo
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ Bloqueado por CORS: ${origin}`);
        callback(new Error("CORS no permitido por el servidor"), false);
      }
    },
    credentials: true,
  })
);


// -------------------- ⏱ Rate Limit --------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas peticiones desde esta IP. Intenta más tarde." },
});
app.use("/api", limiter);

// -------------------- 🖼 Servir imágenes estáticas --------------------
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// -------------------- 🔗 Rutas --------------------
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/products", productRoutes);
app.use("/api/promotions", promotionRoutes);

// -------------------- 🩺 Healthcheck --------------------
app.get("/health", (_, res) => res.status(200).json({ status: "ok", env: NODE_ENV }));

app.get("/", (_, res) => {
  res.send(`
    🍕 API de Rapida&Sabrosa está en funcionamiento 🚀<br>
    Endpoints disponibles:<br>
    • /api/products<br>
    • /api/promotions/active<br>
    • /api/docs<br>
    • /images/pizzas/p1-pizzas01.jpeg
  `);
});

// -------------------- ⚠️ Errores --------------------
app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));
app.use((err, req, res, _next) => {
  console.error("⚠️ Error global capturado:", err);
  res.status(err.status || 500).json({ error: err.message || "Error interno del servidor" });
});

// -------------------- 🚀 Start --------------------
const server = app.listen(PORT, async () => {
  console.log(`🚀 Servidor (${NODE_ENV}) corriendo en puerto ${PORT}`);
  await checkPromotionsExpiration();
});

// -------------------- 🧹 Cierre limpio --------------------
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
