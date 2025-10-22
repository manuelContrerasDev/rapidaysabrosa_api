import { PrismaClient } from "@prisma/client";

let prisma;

if (!global._prisma) {
  global._prisma = new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ["error", "warn"] : ["query", "info", "warn", "error"],
  });

  // ⚠️ Captura errores importantes de Prisma
  global._prisma.$on("error", (err) => {
    console.error("❌ Prisma error:", err);
  });

  // ✅ Escucha el cierre del proceso directamente (Prisma >= 5)
  process.on("SIGINT", async () => {
    console.log("🧹 Cerrando conexión Prisma (SIGINT)...");
    await global._prisma.$disconnect();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("🧹 Cerrando conexión Prisma (SIGTERM)...");
    await global._prisma.$disconnect();
    process.exit(0);
  });
}

prisma = global._prisma;

export default prisma;
