// src/docs/openapi.js
export const swaggerSpec = {
  openapi: "3.1.0",
  info: {
    title: "Rapida&Sabrosa API",
    description:
      "Documentación completa de la API de Rápida&Sabrosa — incluye endpoints de productos, categorías y promociones (Express + Prisma + PostgreSQL).",
    version: "1.2.0",
  },
  servers: [{ url: "http://localhost:4000", description: "Local" }],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-cron-token",
        description:
          "Token de autenticación para endpoints protegidos. Usa el mismo valor que `PROMO_CRON_TOKEN` en .env",
      },
    },
    schemas: {
      // ✅ PRODUCTOS
      Product: {
        type: "object",
        properties: {
          id: { type: "integer", example: 6 },
          name: { type: "string", example: "Pizza Cuatro Quesos" },
          description: {
            type: "string",
            example: "Mozzarella, cheddar, azul y parmesano.",
          },
          price: { type: "string", example: "10999" },
          image_url: {
            type: "string",
            example: "/images/pizzas/cuatroquesos.jpg",
          },
          category_id: { type: "integer", example: 1 },
          available: { type: "boolean", example: true },
        },
        required: ["id", "name", "price", "category_id", "available"],
      },
      ProductCreate: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          image_url: { type: "string" },
          category_id: { type: "number" },
          available: { type: "boolean" },
        },
        required: ["name", "price", "category_id"],
      },
      ProductUpdate: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          image_url: { type: "string" },
          category_id: { type: "number" },
          available: { type: "boolean" },
        },
      },

      // ✅ CATEGORÍAS
      Category: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Pizzas con Pollo" },
          description: { type: "string", example: "Deliciosas pizzas con pollo grillado." },
        },
        required: ["id", "name"],
      },
      CategoryCreate: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
        },
        required: ["name"],
      },

      // ✅ PROMOCIONES
      Promotion: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Semana de la Pizza 🍕" },
          description: {
            type: "string",
            example: "15% de descuento en todas las pizzas.",
          },
          image_url: {
            type: "string",
            example:
              "https://res.cloudinary.com/delycor/image/upload/v1729303001/promo-semana-pizza.jpg",
          },
          discount: { type: "string", example: "15%" },
          valid_until: {
            type: "string",
            example: "2025-10-30T00:00:00.000Z",
          },
          is_active: { type: "boolean", example: true },
        },
      },
      PromoLog: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          message: {
            type: "string",
            example: "⚠️ 1 promoción desactivada automáticamente",
          },
          details: { type: "string", example: "IDs afectadas: 3, 4" },
          created_at: {
            type: "string",
            example: "2025-10-23T18:25:43.000Z",
          },
        },
      },

      // ⚠️ ERRORES
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "Mensaje de error" },
        },
      },
    },
  },

  // -----------------------------------------------------
  // 🧭 ENDPOINTS
  // -----------------------------------------------------
  paths: {
    // ✅ PRODUCTOS
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Listar todos los productos",
        responses: {
          200: {
            description: "Listado de productos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Crear un producto",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductCreate" },
            },
          },
        },
        responses: {
          201: {
            description: "Producto creado exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "✅ Producto creado exitosamente" },
                    product: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Obtener un producto por ID",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: {
          200: {
            description: "Producto encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          404: {
            description: "No encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ✅ CATEGORÍAS
    "/api/categories": {
      get: {
        tags: ["Categories"],
        summary: "Listar todas las categorías",
        responses: {
          200: {
            description: "Listado de categorías",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Category" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Crear una nueva categoría",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CategoryCreate" },
            },
          },
        },
        responses: {
          201: {
            description: "Categoría creada exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "✅ Categoría creada exitosamente" },
                    category: { $ref: "#/components/schemas/Category" },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/categories/{id}": {
      get: {
        tags: ["Categories"],
        summary: "Obtener una categoría por ID",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: {
          200: {
            description: "Categoría encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Category" },
              },
            },
          },
          404: {
            description: "Categoría no encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ✅ PROMOCIONES
    "/api/promotions/active": {
      get: {
        tags: ["Promotions"],
        summary: "Obtener promociones activas y vigentes",
        responses: {
          200: {
            description: "Listado de promociones activas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    count: { type: "integer", example: 3 },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Promotion" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/promotions/check": {
      post: {
        tags: ["Promotions"],
        summary: "Ejecutar verificación manual de promociones",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "x-cron-token",
            in: "header",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Verificación ejecutada correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: {
                      type: "string",
                      example: "Verificación de promociones ejecutada correctamente.",
                    },
                  },
                },
              },
            },
          },
          401: { description: "Acceso no autorizado" },
        },
      },
    },
    "/api/promotions/logs": {
      get: {
        tags: ["Promotions"],
        summary: "Consultar registros de mantenimiento de promociones",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "x-admin-token",
            in: "header",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Historial de logs obtenido correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    count: { type: "integer", example: 3 },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/PromoLog" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
