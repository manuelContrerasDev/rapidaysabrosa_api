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

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Resolver dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Seguridad
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(xss());
app.use(express.json({ limit: "10kb" }));
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://rapidaysabrosa-ecommerce-tlru.vercel.app",
  "https://rapidaysabrosa-api.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else {
        console.warn(`❌ Bloqueado por CORS: ${origin}`);
        callback(new Error("CORS no permitido"), false);
      }
    },
    credentials: true,
  })
);

// ✅ Imágenes con headers correctos
app.use(
  "/images",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
    next();
  },
  express.static(path.join(__dirname, "../public/images"))
);

// Rutas API
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/products", productRoutes);
app.use("/api/promotions", promotionRoutes);

// Healthcheck
app.get("/health", (_, res) =>
  res.status(200).json({ status: "ok", env: NODE_ENV })
);

app.get("/", (_, res) => {
  res.send(`
    🍕 API de Rapida&Sabrosa funcionando 🚀<br>
    Endpoints:<br>
    • /api/products<br>
    • /api/promotions/active<br>
    • /api/docs<br>
    • /images/pizzas/p1-pizzas01.jpeg
  `);
});

// Errores
app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));
app.use((err, req, res, _next) => {
  console.error("⚠️ Error global:", err);
  res.status(err.status || 500).json({ error: err.message || "Error interno" });
});

// Start
const server = app.listen(PORT, async () => {
  console.log(`🚀 Servidor (${NODE_ENV}) en puerto ${PORT}`);
  await checkPromotionsExpiration();
});

// Cierre limpio
const shutdown = async () => {
  console.log("🧹 Cerrando servidor y DB...");
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
