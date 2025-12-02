import express from "express";
import {
  registerUser,
  authUser,
  getUsers,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Registro de usuario
router.post("/register", registerUser);

// Login de usuario
router.post("/login", authUser);

// Obtener todos los usuarios (solo admin)
router.get("/", protect, getUsers);

export default router;
