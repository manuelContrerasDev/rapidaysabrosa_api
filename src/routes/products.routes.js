// routes/products.routes.js
import express from "express";
import {
  getProducts,
  getProductById,
  getProductsByCategory,
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
 * 📦 Rutas base de productos (/api/products)
 */

// ✅ Obtener TODOS los productos
router.get("/", getProducts);

// 🏷️ Obtener productos por categoría
router.get("/category/:id", getProductsByCategory);

// 🔍 Obtener producto por ID
router.get("/:id", getProductById);

// ➕ Crear producto
router.post("/", strictLimiter, validate(productCreateSchema), createProduct);

// ♻️ Actualizar producto
router.put("/:id", validate(productUpdateSchema), updateProduct);

// 🗑️ Eliminar producto
router.delete("/:id", deleteProduct);

export default router;
