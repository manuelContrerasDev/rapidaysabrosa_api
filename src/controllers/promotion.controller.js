import { PrismaClient } from "@prisma/client";
import { checkPromotionsExpiration } from "../utils/checkPromotionsExpiration.js";

const prisma = new PrismaClient();

/**
 * Obtener promociones activas y vigentes.
 * Limpia automáticamente las vencidas antes de responder.
 */
export const getActivePromotions = async (req, res) => {
  try {
    await checkPromotionsExpiration(); // 🔄 Limpieza automática

    const now = new Date();
    const promotions = await prisma.promotions.findMany({
      where: { is_active: true, valid_until: { gte: now } }, // <= ahora usa gte (mayor o igual)
      orderBy: { valid_until: "asc" },
    });

    if (promotions.length === 0) {
      return res.status(404).json({ message: "No hay promociones activas actualmente." });
    }

    res.json({
      status: "success",
      count: promotions.length,
      data: promotions,
    });
  } catch (error) {
    console.error("❌ Error obteniendo promociones activas:", error);
    res.status(500).json({ error: "Error al obtener promociones activas." });
  }
};

/**
 * Obtener logs de mantenimiento de promociones (solo admin)
 */
export const getPromotionLogs = async (req, res) => {
  try {
    const token = req.headers["x-admin-token"];
    if (token !== process.env.PROMO_CRON_TOKEN) {
      return res.status(401).json({ error: "Acceso no autorizado" });
    }

    const logs = await prisma.promo_logs.findMany({
      orderBy: { created_at: "desc" },
      take: 50, // últimos 50 registros
    });

    res.json({
      status: "success",
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error("❌ Error al obtener logs de promociones:", error);
    res.status(500).json({ error: "Error al obtener registros de promociones." });
  }
};
