// prisma/seedImages.js
import prisma from "../src/config/db.js";

const BASE_URL = "https://rapidaysabrosa-api.onrender.com/images";

const imageMap = [
  { id: 1, category: "pizzas", file: "p1-pizzas01.jpeg" },
  { id: 2, category: "pizzas", file: "p2-pizzas01.jpeg" },
  { id: 3, category: "pizzas", file: "p3-pizzas01.jpeg" },
  { id: 4, category: "pizzas", file: "p4-pizzas01.jpeg" },
  { id: 5, category: "pizzas", file: "p5-pizzas01.jpeg" },
  { id: 6, category: "pizzas", file: "p6-pizzas01.jpeg" },

  { id: 7, category: "burgers", file: "b1-burger01.jpg" },
  { id: 8, category: "burgers", file: "b2-burger02.jpg" },
  { id: 9, category: "burgers", file: "b3-burger03.jpg" },
  { id: 10, category: "burgers", file: "b4-burger04.jpg" },
  { id: 11, category: "burgers", file: "b5-burger05.jpg" },

  { id: 12, category: "desserts", file: "ds01-dessert01.jpg" },
  { id: 13, category: "desserts", file: "ds02-dessert02.jpg" },
  { id: 14, category: "desserts", file: "ds03-dessert03.jpg" },
  { id: 15, category: "desserts", file: "ds04-dessert04.jpg" },
  { id: 16, category: "desserts", file: "ds05-dessert05.jpg" },
  { id: 17, category: "desserts", file: "ds06-dessert06.jpg" },

  { id: 18, category: "drinks", file: "d1-bebida01.png" },
  { id: 19, category: "drinks", file: "d2-juice01.jpg" },
  { id: 20, category: "drinks", file: "d3-water01.jpg" },
];

async function main() {
  console.log("🚀 Iniciando actualización de imágenes...");

  try {
    await prisma.$connect();
    console.log("✅ Conexión exitosa a la base de datos Render.");
  } catch (err) {
    console.error("❌ Error al conectar a la base de datos:", err);
    process.exit(1);
  }

  const count = await prisma.products.count();
  console.log(`📦 Productos detectados: ${count}`);

  for (const { id, category, file } of imageMap) {
    const url = `${BASE_URL}/${category}/${file}`;
    try {
      await prisma.products.update({
        where: { id },
        data: { image_url: url },
      });
      console.log(`✅ Producto ${id} actualizado con ${url}`);
    } catch (err) {
      console.error(`⚠️ Error al actualizar producto ${id}: ${err.message}`);
    }
  }

  console.log("🎉 Actualización completada.");
}

main()
  .catch((e) => {
    console.error("❌ Error global:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
