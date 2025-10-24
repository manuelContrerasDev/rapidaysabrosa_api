import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Verifica promociones expiradas y las desactiva automáticamente
 */
export const checkPromotionsExpiration = async () => {
  const now = new Date();

  try {
    const expiredPromos = await prisma.promotions.updateMany({
      where: {
        is_active: true,
        valid_until: { lt: now },
      },
      data: { is_active: false },
    });

    if (expiredPromos.count > 0) {
      console.log(`⚠️ ${expiredPromos.count} promociones expiradas desactivadas automáticamente.`);
    }
  } catch (error) {
    console.error("❌ Error al verificar expiraciones de promociones:", error);
  }
};
