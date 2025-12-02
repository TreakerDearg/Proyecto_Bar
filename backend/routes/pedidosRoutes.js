// routes/pedidosRoutes.js
import express from "express";
import {
  createPedido,
  getAllPedidos,
  updatePedido
} from "../controllers/pedidosController.js";

import { protect, soloRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Público → crear pedido
router.post("/", createPedido);

// Bartender o admin → ver y actualizar pedidos
router.get("/", protect, soloRoles("bartender", "admin"), getAllPedidos);
router.patch("/:id", protect, soloRoles("bartender", "admin"), updatePedido);

export default router;
