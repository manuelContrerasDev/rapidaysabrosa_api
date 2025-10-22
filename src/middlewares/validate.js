// src/middlewares/validate.js
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Si el esquema tiene body, params o query, lo analizamos completo
      const data = {
        body: req.body,
        params: req.params,
        query: req.query,
      };

      // Algunos esquemas pueden ser solo body, por eso usamos safeParse
      const parsed = schema.safeParse(data.body || data);

      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        }));
        return res.status(400).json({
          error: "Datos inválidos",
          details: errors,
        });
      }

      // ✅ Sobrescribimos los datos ya validados
      req.body = parsed.data;
      next();
    } catch (err) {
      console.error("❌ Error en middleware validate:", err);
      res.status(500).json({ error: "Error interno de validación" });
    }
  };
};
