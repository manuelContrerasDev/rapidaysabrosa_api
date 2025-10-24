import express from "express";
import { getActivePromotions, getPromotionLogs } from "../controllers/promotion.controller.js";
import { checkPromotionsExpiration } from "../utils/checkPromotionsExpiration.js";

const router = express.Router();

/**
 * @route GET /api/promotions/active
 * @desc Obtener promociones activas y vigentes
 * @access Público
 */
router.get("/active", getActivePromotions);

/**
 * @route POST /api/promotions/check
 * @desc Ejecutar verificación manual (para Render o administrador)
 * @access Protegido (x-cron-token)
 */
router.post("/check", async (req, res) => {
  try {
    const token = req.headers["x-cron-token"];
    if (token !== process.env.PROMO_CRON_TOKEN) {
      return res.status(401).json({ error: "Acceso no autorizado" });
    }

    await checkPromotionsExpiration();
    res.json({
      status: "success",
      message: "Verificación de promociones ejecutada correctamente.",
    });
  } catch (error) {
    console.error("❌ Error al ejecutar verificación manual:", error);
    res.status(500).json({ error: "Error interno durante la verificación." });
  }
});

/**
 * @route GET /api/promotions/logs
 * @desc Consultar registros de mantenimiento de promociones
 * @access Protegido (x-admin-token)
 */
router.get("/logs", getPromotionLogs);

export default router;
