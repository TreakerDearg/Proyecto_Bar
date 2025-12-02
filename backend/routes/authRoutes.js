// routes/authRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  logoutUser
} from "../controllers/authcontroller.js";

import { protect, soloAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Registro
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Perfil del usuario logueado
router.get("/profile", protect, getProfile);

// Logout
router.post("/logout", protect, logoutUser);

// (Ejemplo) Ruta protegida solo para admin
router.get("/admin/solo-admin", protect, soloAdmin, (req, res) => {
  res.json({
    estado: "ok",
    mensaje: "Acceso otorgado: solo admin"
  });
});

export default router;
