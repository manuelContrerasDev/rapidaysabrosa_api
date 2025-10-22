import prisma from "../config/db.js";
import {
  productCreateSchema,
  productUpdateSchema,
} from "../validators/product.validator.js";

/**
 * 🔍 Obtener lista de productos (con paginación, búsqueda y orden)
 * GET /api/products?page=1&limit=10&search=texto&order=asc
 */
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || "";
    const order = req.query.order === "desc" ? "desc" : "asc";

    const skip = (page - 1) * limit;

    // Consulta con filtro, búsqueda y orden
    const [total, products] = await Promise.all([
      prisma.products.count({
        where: {
          name: { contains: search, mode: "insensitive" },
        },
      }),
      prisma.products.findMany({
        where: {
          name: { contains: search, mode: "insensitive" },
        },
        orderBy: { name: order },
        skip,
        take: limit,
      }),
    ]);

    res.json({
      meta: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: products,
    });
  } catch (error) {
    console.error("❌ [getProducts] Error:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

/**
 * 🧾 Obtener producto por ID
 * GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const product = await prisma.products.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error("❌ [getProductById] Error:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

/**
 * ➕ Crear un nuevo producto
 * POST /api/products
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
 * ♻️ Actualizar producto existente
 * PUT /api/products/:id
 */
export const updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const parsed = productUpdateSchema.parse(req.body);

    const existing = await prisma.products.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const updated = await prisma.products.update({
      where: { id },
      data: { ...existing, ...parsed },
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
 * 🗑️ Eliminar producto
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const existing = await prisma.products.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

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
