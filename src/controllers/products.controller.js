// controllers/products.controller.js
import prisma from "../config/db.js";
import {
  productCreateSchema,
  productUpdateSchema,
} from "../validators/product.validator.js";

/**
 * =====================================================
 * 🧾 Obtener TODOS los productos
 * GET /api/products?search=&order=asc&vegetarian=true
 * =====================================================
 */
export const getProducts = async (req, res) => {
  try {
    const search = req.query.search || "";
    const order = req.query.order === "desc" ? "desc" : "asc";
    const vegetarian = req.query.vegetarian === "true";

    // 🎯 Filtros opcionales
    const whereClause = {
      name: { contains: search, mode: "insensitive" },
      ...(vegetarian ? { isVegetarian: true } : {}),
    };

    // 🔍 Obtener todos los productos sin límite
    const products = await prisma.products.findMany({
      where: whereClause,
      orderBy: { name: order },
    });

    res.json({
      meta: {
        total: products.length,
        filters: { search, order, vegetarian },
      },
      data: products,
    });
  } catch (error) {
    console.error("❌ [getProducts] Error:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

/**
 * =====================================================
 * 🏷️ Obtener productos por categoría
 * GET /api/products/category/:id?search=&order=asc&vegetarian=true
 * =====================================================
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const search = req.query.search || "";
    const order = req.query.order === "desc" ? "desc" : "asc";
    const vegetarian = req.query.vegetarian === "true";

    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "ID de categoría inválido" });
    }

    // 🎯 Filtros combinados
    const whereClause = {
      category_id: categoryId,
      name: { contains: search, mode: "insensitive" },
      ...(vegetarian ? { isVegetarian: true } : {}),
    };

    // 🔍 Buscar todos los productos de la categoría
    const products = await prisma.products.findMany({
      where: whereClause,
      orderBy: { name: order },
    });

    if (products.length === 0) {
      return res.status(404).json({
        message: "No se encontraron productos en esta categoría con los filtros aplicados",
      });
    }

    res.json({
      meta: {
        category_id: categoryId,
        total: products.length,
        filters: { search, order, vegetarian },
      },
      data: products,
    });
  } catch (error) {
    console.error("❌ [getProductsByCategory] Error:", error);
    res.status(500).json({ error: "Error al obtener productos por categoría" });
  }
};

/**
 * =====================================================
 * 🔍 Obtener producto individual
 * GET /api/products/:id
 * =====================================================
 */
export const getProductById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const product = await prisma.products.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    res.json(product);
  } catch (error) {
    console.error("❌ [getProductById] Error:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

/**
 * =====================================================
 * ➕ Crear producto
 * =====================================================
 */
export const createProduct = async (req, res) => {
  try {
    const parsed = productCreateSchema.parse(req.body);

    const newProduct = await prisma.products.create({
      data: {
        name: parsed.name,
        description: parsed.description || null,
        price: Number(parsed.price),
        image_url: parsed.image_url || null,
        category_id: Number(parsed.category_id),
        available: parsed.available ?? true,
        isVegetarian: parsed.isVegetarian ?? false,
      },
    });

    res.status(201).json({
      message: "✅ Producto creado exitosamente",
      product: newProduct,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Datos inválidos",
        details: error.errors.map((e) => e.message),
      });
    }
    console.error("❌ [createProduct] Error:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

/**
 * =====================================================
 * ♻️ Actualizar producto
 * =====================================================
 */
export const updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const parsed = productUpdateSchema.parse(req.body);
    const existing = await prisma.products.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Producto no encontrado" });

    const updated = await prisma.products.update({
      where: { id },
      data: { ...parsed },
    });

    res.json({
      message: "🧩 Producto actualizado correctamente",
      product: updated,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Datos inválidos",
        details: error.errors.map((e) => e.message),
      });
    }
    console.error("❌ [updateProduct] Error:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

/**
 * =====================================================
 * 🗑️ Eliminar producto
 * =====================================================
 */
export const deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const existing = await prisma.products.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Producto no encontrado" });

    await prisma.products.delete({ where: { id } });

    res.json({
      message: "🗑️ Producto eliminado correctamente",
      deletedId: id,
    });
  } catch (error) {
    console.error("❌ [deleteProduct] Error:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};
