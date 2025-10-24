# 🍕 Rapida&Sabrosa API

API RESTful para la plataforma de pedidos **Rapida&Sabrosa**, desarrollada en **Node.js + Express + Prisma + PostgreSQL**.  
Diseñada para gestionar productos, categorías, pedidos, clientes y pagos de manera segura y escalable.  
Incluye validaciones con **Zod**, seguridad con **Helmet**, control de peticiones, sanitización de inputs y documentación Swagger.

---

## 🚀 Tecnologías principales

| Categoría | Tecnología |
|------------|-------------|
| **Runtime / Framework** | Node.js 22, Express 5 |
| **ORM / BD** | Prisma ORM + PostgreSQL |
| **Validación** | Zod |
| **Seguridad** | Helmet, express-rate-limit, express-xss-sanitizer |
| **Documentación** | Swagger UI |
| **Logs** | Morgan |
| **Deploy** | Render (Backend) + Vercel (Frontend) |

---

## ⚙️ Estructura del proyecto

rapidaysabrosa_api/
│
├── prisma/
│ ├── schema.prisma # Definición del modelo de datos
│ └── seed.sql # Datos iniciales (categorías, productos)
│
├── src/
│ ├── config/ # Configuración (DB, entorno)
│ ├── controllers/ # Controladores de las rutas
│ ├── docs/ # Swagger / OpenAPI
│ ├── middlewares/ # Middlewares personalizados
│ ├── routes/ # Definición de endpoints
│ ├── validators/ # Validaciones Zod
│ └── server.js # Entrada principal del servidor
│
├── .env # Variables de entorno (no subir a GitHub)
├── package.json
└── README.md


---

## 🧩 Instalación local

1️⃣ Clona el repositorio:
```bash
git clone https://github.com/manuelContrerasDev/rapidaysabrosa_api.git
cd rapidaysabrosa_api

2️⃣ Instala las dependencias:

npm install

3️⃣ Genera el cliente Prisma:

npx prisma generate

4️⃣ Ejecuta migraciones (crea las tablas en tu BD local):

npx prisma migrate dev --name init_schema

5️⃣ Inicia el servidor:

npm run dev

👉 API disponible en: http://localhost:4000

📦 Endpoints principales
Método	Ruta	Descripción
GET	/api/products	Obtiene todos los productos
GET	/api/products/:id	Obtiene un producto por ID
POST	/api/products	Crea un nuevo producto
PUT	/api/products/:id	Actualiza un producto existente
DELETE	/api/products/:id	Elimina un producto
GET	/api/docs	Accede a la documentación Swagger