import express from "express";
import {
  getAllTragos,
  createTrago,
  updateTrago,
  deleteTrago
} from "../controllers/tragosController.js";

import { protect, soloRoles } from "../middlewares/authMiddleware.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// ========================================
// CONFIGURACIÓN CLOUDINARY + MULTER
// ========================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tragos",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

const parser = multer({ storage });

// ========================================
// RUTAS
// ========================================

// Público → lista de tragos
router.get("/", getAllTragos);

// Solo admin o superadmin → crear trago con imagen
router.post(
  "/",
  protect,
  soloRoles("admin", "superadmin"),
  parser.single("imagen"),
  createTrago
);

// Solo admin o superadmin → actualizar trago (puede incluir nueva imagen)
router.put(
  "/:id",
  protect,
  soloRoles("admin", "superadmin"),
  parser.single("imagen"),
  updateTrago
);

// Solo superadmin → eliminar trago
router.delete(
  "/:id",
  protect,
  soloRoles("superadmin"),
  deleteTrago
);

export default router;
