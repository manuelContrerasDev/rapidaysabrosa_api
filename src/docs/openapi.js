// src/docs/openapi.js
export const swaggerSpec = {
  openapi: "3.1.0",
  info: {
    title: "Rapida&Sabrosa API",
    description: "Documentación de la API para productos (Express + Prisma + PostgreSQL).",
    version: "1.0.0",
  },
  servers: [
    { url: "http://localhost:4000", description: "Local" }
  ],
  components: {
    schemas: {
      // Nota: Prisma devuelve Decimal como string en JSON
      Product: {
        type: "object",
        properties: {
          id: { type: "integer", example: 6 },
          name: { type: "string", example: "Pizza Cuatro Quesos" },
          description: { type: "string", example: "Mozzarella, cheddar, azul y parmesano." },
          price: { type: "string", example: "10999" },
          image_url: { type: "string", example: "/images/pizzas/cuatroquesos.jpg" },
          category_id: { type: "integer", example: 1 },
          available: { type: "boolean", example: true }
        },
        required: ["id", "name", "price", "category_id", "available"]
      },
      ProductCreate: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          image_url: { type: "string" },
          category_id: { type: "number" },
          available: { type: "boolean" }
        },
        required: ["name", "price", "category_id"]
      },
      ProductUpdate: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          image_url: { type: "string" },
          category_id: { type: "number" },
          available: { type: "boolean" }
        }
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "Mensaje de error" }
        }
      }
    }
  },
  paths: {
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Listar todos los productos",
        responses: {
          200: {
            description: "Listado de productos",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Product" } }
              }
            }
          }
        }
      },
      post: {
        tags: ["Products"],
        summary: "Crear un producto",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductCreate" }
            }
          }
        },
        responses: {
          201: {
            description: "Producto creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "✅ Producto creado exitosamente" },
                    product: { $ref: "#/components/schemas/Product" }
                  }
                }
              }
            }
          },
          400: { description: "Solicitud inválida", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" }}}}
        }
      }
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Obtener un producto por ID",
        parameters: [
          { in: "path", name: "id", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: { description: "Producto", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" }}}},
          404: { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" }}}}
        }
      },
      put: {
        tags: ["Products"],
        summary: "Actualizar un producto por ID",
        parameters: [
          { in: "path", name: "id", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ProductUpdate" } } }
        },
        responses: {
          200: {
            description: "Producto actualizado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "🧩 Producto actualizado correctamente" },
                    product: { $ref: "#/components/schemas/Product" }
                  }
                }
              }
            }
          },
          404: { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" }}}}
        }
      },
      delete: {
        tags: ["Products"],
        summary: "Eliminar un producto por ID",
        parameters: [
          { in: "path", name: "id", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: {
            description: "Eliminado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "🗑️ Producto eliminado correctamente" },
                    deletedId: { oneOf: [{ type: "string" }, { type: "integer" }], example: 6 }
                  }
                }
              }
            }
          },
          404: { description: "No encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" }}}}
        }
      }
    }
  }
};
