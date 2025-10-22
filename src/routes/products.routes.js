import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  productCreateSchema,
  productUpdateSchema,
} from "../validators/product.validator.js";
import { strictLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

/**
 * Rutas de productos (base: /api/products)
 * Incluye validaciones, rate limit y estructura REST completa.
 */

// 📦 Obtener lista de productos (con paginación, búsqueda, etc.)
router.get("/", getProducts);

// 🔍 Obtener un producto por ID
router.get("/:id", getProductById);

// ➕ Crear producto (con validación y limitador)
router.post("/", strictLimiter, validate(productCreateSchema), createProduct);

// ♻️ Actualizar producto por ID (validación)
router.put("/:id", validate(productUpdateSchema), updateProduct);

// 🗑️ Eliminar producto
router.delete("/:id", deleteProduct);

export default router;
