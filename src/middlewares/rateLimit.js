// src/middlewares/rateLimit.js
import rateLimit from "express-rate-limit";

/**
 * 🔒 Límite global de peticiones (aplica a /api)
 * 100 requests cada 15 minutos por IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true, // devuelve info en headers
  legacyHeaders: false,
  message: {
    error: "Demasiadas peticiones desde esta IP, inténtalo más tarde 🕐",
  },
});

/**
 * ⚙️ Límite estricto para endpoints sensibles (auth, createProduct, etc.)
 * 30 requests cada 5 minutos
 */
export const strictLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiadas solicitudes. Espera un momento antes de intentarlo nuevamente.",
  },
});
                                      