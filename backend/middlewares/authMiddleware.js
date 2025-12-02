// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =========================================
// 🔐 PROTEGER RUTAS (REQUIERE TOKEN)
// =========================================
export const protect = async (req, res, next) => {
  try {
    let token;

    // Token en Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        estado: "error",
        mensaje: "No autorizado, token no proporcionado",
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario (sin password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        estado: "error",
        mensaje: "Token válido pero el usuario no existe",
      });
    }

    req.user = user; // Adjuntar usuario a request
    next();

  } catch (error) {
    return res.status(401).json({
      estado: "error",
      mensaje: "No autorizado, token inválido",
    });
  }
};

// =========================================
// 🔐 SOLO ADMIN
// =========================================
export const soloAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== "admin") {
    return res.status(403).json({
      estado: "error",
      mensaje: "Acceso denegado: solo administradores",
    });
  }
  next();
};

// =========================================
// 🔐 SOLO BARTENDERS
// =========================================
export const soloBartender = (req, res, next) => {
  if (!req.user || req.user.rol !== "bartender") {
    return res.status(403).json({
      estado: "error",
      mensaje: "Acceso denegado: solo bartenders",
    });
  }
  next();
};

// =========================================
// 🔐 SOLO SUPERADMIN
// =========================================
export const soloSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== "superadmin") {
    return res.status(403).json({
      estado: "error",
      mensaje: "Requiere permisos de superadministrador",
    });
  }
  next();
};

// =========================================
// 🔐 VALIDACIÓN DINÁMICA POR ROLES
// =========================================
export const soloRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        estado: "error",
        mensaje: `Acceso denegado, roles permitidos: ${rolesPermitidos.join(", ")}`,
      });
    }
    next();
  };
};
