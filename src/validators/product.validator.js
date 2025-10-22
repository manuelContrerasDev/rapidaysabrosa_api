import { z } from "zod";

// Validación para crear producto
export const productCreateSchema = z.object({
  name: z.string({
    required_error: "El nombre es obligatorio",
    invalid_type_error: "El nombre debe ser texto",
  }).min(3, "El nombre debe tener al menos 3 caracteres"),

  description: z.string().optional(),

price: z
  .union([z.string(), z.number()])
  .transform((val) => Number(val))
  .refine((val) => Number.isInteger(val) && val > 0, {
    message: "El precio debe ser un número entero positivo (CLP)",
  }),

  image_url: z.string().optional(),

  category_id: z.number({
    required_error: "La categoría es obligatoria",
    invalid_type_error: "El ID de categoría debe ser numérico",
  }),

  available: z.boolean().optional(),
});

// Validación para actualizar producto
export const productUpdateSchema = productCreateSchema.partial();
