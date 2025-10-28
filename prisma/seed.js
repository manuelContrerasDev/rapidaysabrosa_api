import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const IMAGE_BASE = "https://rapidaysabrosa-api.onrender.com/images";

async function main() {
  console.log("🌱 Iniciando seed extendido Rápida & Sabrosa (Render Edition)...");

  // 1️⃣ Categorías base
  const categories = [
    "Pizzas con Charcutería",
    "Pizzas con Pollo",
    "Pizzas con Mechada",
    "Pizzas con Filete",
    "Pizzas con Camarón",
    "Pizzas Vegetarianas",
    "Hamburguesas",
    "Platos",
    "Bebidas",
    "Agregados",
    "Promociones",
  ];

  for (const name of categories) {
    await prisma.categories.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✅ Categorías insertadas correctamente");

  // 2️⃣ Obtener IDs de categorías
  const cat = {};
  for (const c of categories) {
    const data = await prisma.categories.findUnique({ where: { name: c } });
    cat[c] = data.id;
  }

  // 3️⃣ Productos con rutas actualizadas a Render
  const products = [
    // --- PIZZAS CON CHARCUTERÍA ---
    {
      name: "Pizza Napolitana",
      description: "Tomate, jamón, aceitunas y queso mozzarella.",
      price: 13000.0,
      image_url: `${IMAGE_BASE}/pizzas/napolitana.jpg`,
      category_id: cat["Pizzas con Charcutería"],
      isVegetarian: false,
    },
    {
      name: "Pizza Española",
      description: "Chorizo español, cebolla morada y aceitunas negras.",
      price: 13000.0,
      image_url: `${IMAGE_BASE}/pizzas/espanola.jpg`,
      category_id: cat["Pizzas con Charcutería"],
      isVegetarian: false,
    },
    {
      name: "Pizza Cuatro Estaciones",
      description: "Jamón, champiñones, pimentón y aceitunas verdes.",
      price: 13000.0,
      image_url: `${IMAGE_BASE}/pizzas/cuatro-estaciones.jpg`,
      category_id: cat["Pizzas con Charcutería"],
      isVegetarian: false,
    },

    // --- PIZZAS CON POLLO ---
    {
      name: "Pizza Pollo BBQ",
      description: "Pollo a la parrilla, salsa BBQ y queso mozzarella.",
      price: 13000.0,
      image_url: `${IMAGE_BASE}/pizzas/pollo-bbq.jpg`,
      category_id: cat["Pizzas con Pollo"],
      isVegetarian: false,
    },
    {
      name: "Pizza Pollo Champiñón",
      description: "Pollo, champiñones y cebolla caramelizada.",
      price: 13000.0,
      image_url: `${IMAGE_BASE}/pizzas/pollo-champinon.jpg`,
      category_id: cat["Pizzas con Pollo"],
      isVegetarian: false,
    },

    // --- PIZZAS CON MECHADA ---
    {
      name: "Pizza Mechada Italiana",
      description: "Carne mechada, palta y tomate fresco.",
      price: 13000.0,
      image_url: `${IMAGE_BASE}/pizzas/mechada-italiana.jpg`,
      category_id: cat["Pizzas con Mechada"],
      isVegetarian: false,
    },
    {
      name: "Pizza Mechada BBQ",
      description: "Carne mechada con salsa BBQ y queso cheddar.",
      price: 13000.0,
      image_url: `${IMAGE_BASE}/pizzas/mechada-bbq.jpg`,
      category_id: cat["Pizzas con Mechada"],
      isVegetarian: false,
    },

    // --- PIZZAS CON FILETE ---
    {
      name: "Pizza Filete BBQ",
      description: "Filete de res, pimentón y cebolla salteada con BBQ.",
      price: 13000.0,
      image_url: `${IMAGE_BASE}/pizzas/filete-bbq.jpg`,
      category_id: cat["Pizzas con Filete"],
      isVegetarian: false,
    },
    {
      name: "Pizza Filete Chilena",
      description: "Filete, cebolla, ají verde y huevo duro.",
      price: 13000.0,
      image_url: `${IMAGE_BASE}/pizzas/filete-chilena.jpg`,
      category_id: cat["Pizzas con Filete"],
      isVegetarian: false,
    },

    // --- PIZZAS CON CAMARÓN ---
    {
      name: "Pizza Camarón y Queso",
      description: "Camarones al ajillo con mozzarella.",
      price: 13000.0,
      image_url: `${IMAGE_BASE}/pizzas/camaron-queso.jpg`,
      category_id: cat["Pizzas con Camarón"],
      isVegetarian: false,
    },
    {
      name: "Pizza Camarón BBQ",
      description: "Camarones salteados con salsa BBQ.",
      price: 13000.0,
      image_url: `${IMAGE_BASE}/pizzas/camaron-bbq.jpg`,
      category_id: cat["Pizzas con Camarón"],
      isVegetarian: false,
    },

    // --- PIZZAS VEGETARIANAS ---
    {
      name: "Pizza Sabrosa",
      description: "Tomate, champiñón, choclo, pimentón y aceitunas.",
      price: 13000.0,
      image_url: `${IMAGE_BASE}/pizzas/sabrosa.jpg`,
      category_id: cat["Pizzas Vegetarianas"],
      isVegetarian: true,
    },
    {
      name: "Pizza Griega",
      description: "Aceitunas, cebolla morada, tomate cherry y queso feta.",
      price: 13000.0,
      image_url: `${IMAGE_BASE}/pizzas/griega.jpg`,
      category_id: cat["Pizzas Vegetarianas"],
      isVegetarian: true,
    },

    // --- HAMBURGUESAS ---
    {
      name: "Hamburguesa Clásica",
      description: "Carne 200g, lechuga, tomate, queso cheddar y mayo casera.",
      price: 9000.0,
      image_url: `${IMAGE_BASE}/burgers/hamburguesa-clasica.jpg`,
      category_id: cat["Hamburguesas"],
    },
    {
      name: "Hamburguesa Italiana",
      description: "Palta, tomate y mayonesa, estilo chileno.",
      price: 9000.0,
      image_url: `${IMAGE_BASE}/burgers/hamburguesa-italiana.jpg`,
      category_id: cat["Hamburguesas"],
    },

    // --- PLATOS ---
    {
      name: "Chorrillana Clásica",
      description: "Papas fritas, cebolla, carne y huevo frito.",
      price: 12000.0,
      image_url: `${IMAGE_BASE}/platos/chorrillana.jpg`,
      category_id: cat["Platos"],
    },
    {
      name: "Costillas BBQ",
      description: "Costillas de cerdo con salsa BBQ y papas rústicas.",
      price: 12000.0,
      image_url: `${IMAGE_BASE}/platos/costillas-bbq.jpg`,
      category_id: cat["Platos"],
    },

    // --- BEBIDAS ---
    {
      name: "Coca-Cola 1.5L",
      description: "Bebida gaseosa tradicional.",
      price: 1990.0,
      image_url: `${IMAGE_BASE}/drinks/cocacola.jpg`,
      category_id: cat["Bebidas"],
    },
    {
      name: "Jugo Natural Frutilla",
      description: "Refrescante jugo de fruta natural.",
      price: 2500.0,
      image_url: `${IMAGE_BASE}/drinks/jugo-frutilla.jpg`,
      category_id: cat["Bebidas"],
    },

    // --- AGREGADOS ---
    {
      name: "Porción de Queso",
      description: "Extra de queso mozzarella fundido.",
      price: 1500.0,
      image_url: `${IMAGE_BASE}/agregados/porcion-queso.jpg`,
      category_id: cat["Agregados"],
    },
    {
      name: "Porción de Papas Fritas",
      description: "Acompañamiento crujiente y salado.",
      price: 2500.0,
      image_url: `${IMAGE_BASE}/agregados/papas-fritas.jpg`,
      category_id: cat["Agregados"],
    },

    // --- PROMOCIONES ---
    {
      name: "Promo Familiar Pizza + Bebida",
      description: "1 Pizza a elección + 1 bebida de 1.5L.",
      price: 14500.0,
      image_url: `${IMAGE_BASE}/promos/promo-familiar.jpg`,
      category_id: cat["Promociones"],
      is_promo: true,
      discount: 5.0,
    },
    {
      name: "Promo Pareja",
      description: "2 pizzas medianas + 1 bebida 1.5L.",
      price: 24990.0,
      image_url: `${IMAGE_BASE}/promos/promo-pareja.jpg`,
      category_id: cat["Promociones"],
      is_promo: true,
      discount: 10.0,
    },
  ];

  await prisma.products.deleteMany();
  await prisma.promotions.deleteMany();
  console.log("🧼 Datos antiguos eliminados");

  await prisma.products.createMany({ data: products });
  console.log(`✅ ${products.length} productos insertados correctamente.`);

  // 4️⃣ Promociones automáticas
  const now = new Date();
  const promotions = [
    {
      title: "Semana de la Pizza 🍕",
      description: "15% de descuento en todas las pizzas.",
      image_url: `${IMAGE_BASE}/promos/promo-semana-pizza.jpg`,
      discount: "15%",
      valid_until: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
      is_active: true,
    },
    {
      title: "2x1 en Hamburguesas 🍔",
      description: "Llévate 2 hamburguesas al precio de 1 todos los viernes.",
      image_url: `${IMAGE_BASE}/promos/promo-2x1-burger.jpg`,
      discount: "50%",
      valid_until: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
      is_active: true,
    },
    {
      title: "Promo Halloween 🎃",
      description: "20% de descuento en pizzas con mechada hasta el 31 de octubre.",
      image_url: `${IMAGE_BASE}/promos/promo-halloween.jpg`,
      discount: "20%",
      valid_until: new Date("2025-10-31T23:59:59.000Z"),
      is_active: true,
    },
  ];

  await prisma.promotions.createMany({ data: promotions });
  console.log(`🎯 ${promotions.length} promociones insertadas correctamente.`);
  console.log("🌿 Seed completado 🚀");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
