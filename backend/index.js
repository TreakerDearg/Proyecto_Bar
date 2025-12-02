// ========================================
//  IMPORTS
// ========================================
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Middlewares
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

// Rutas
import authRoutes from "./routes/authRoutes.js";
import tragosRoutes from "./routes/tragosRoutes.js";
import pedidosRoutes from "./routes/pedidosRoutes.js";

// ========================================
//  CONFIG DOTENV
// ========================================
dotenv.config();
const mongoUri = process.env.MONGO_URI;
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
const nodeEnv = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 5000;

if (!mongoUri) {
  console.error("❌ ERROR: Falta la variable MONGO_URI en .env");
  process.exit(1);
}

// ========================================
//  CREAR APP
// ========================================
const app = express();

// ========================================
//  CORS CONFIG
// ========================================
const whitelist = [
  clientUrl,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  /\.vercel\.app$/,
  /\.onrender\.com$/,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const permitido = whitelist.some(rule =>
        rule instanceof RegExp ? rule.test(origin) : rule === origin
      );

      if (permitido) {
        callback(null, true);
      } else {
        callback(new Error(`❌ CORS bloqueó origen no permitido: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ========================================
//  PARSE JSON
// ========================================
app.use(express.json({ limit: "10mb" }));

// ========================================
//  RUTAS
// ========================================
const routes = [
  { path: "/api/auth", route: authRoutes },
  { path: "/api/tragos", route: tragosRoutes },
  { path: "/api/pedidos", route: pedidosRoutes },
];

// Cargar rutas y log
routes.forEach(r => {
  app.use(r.path, r.route);
  console.log(`✅ Ruta cargada: ${r.path}`);
});

// ========================================
//  HEALTH CHECK + LISTADO DE ENDPOINTS
// ========================================
app.get("/api", (req, res) => {
  const routeDetails = routes
    .map(r => {
      const stack = r.route.stack
        .filter(layer => layer.route)
        .map(layer => {
          const methods = Object.keys(layer.route.methods)
            .map(m => m.toUpperCase());
          return {
            path: `${r.path}${layer.route.path}`,
            methods,
          };
        });
      return stack;
    })
    .flat();

  res.status(200).json({
    success: true,
    message: "🚀 Backend activo",
    routesAvailable: routeDetails,
    timestamp: new Date(),
  });
});

// ========================================
//  404 NOT FOUND
// ========================================
app.use(notFound);

// ========================================
//  GLOBAL ERROR HANDLER
// ========================================
app.use(errorHandler);

// ========================================
//  INICIO DEL SERVIDOR + CONEXIÓN MONGO
// ========================================
async function startServer() {
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB conectado exitosamente");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT} (${nodeEnv})`);
    });
  } catch (err) {
    console.error("❌ Error al conectar con MongoDB:");
    console.error(err.message);
    process.exit(1);
  }
}

startServer();
