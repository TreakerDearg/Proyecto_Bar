// controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// -------------------------------------------
// 🔐 GENERAR TOKEN JWT
// -------------------------------------------
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// -------------------------------------------
// 🟢 REGISTRO DE USUARIO
// -------------------------------------------
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, rol } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        estado: "error",
        mensaje: "Todos los campos son obligatorios",
      });
    }

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(409).json({
        estado: "error",
        mensaje: "El email ya está registrado",
      });
    }

    // Se crea el usuario — el password se hashea automáticamente en el modelo
    const user = await User.create({
      name,
      email,
      password,
      rol: rol || "bartender", // por defecto bartender
    });

    return res.status(201).json({
      estado: "ok",
      mensaje: "Usuario registrado correctamente",
      usuario: {
        id: user._id,
        name: user.name,
        email: user.email,
        rol: user.rol,
      },
      token: generarToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------
// 🔵 LOGIN DE USUARIO
// -------------------------------------------
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        estado: "error",
        mensaje: "Email y contraseña son obligatorios",
      });
    }

    // Trae password explícitamente porque en el modelo tiene select:false
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        estado: "error",
        mensaje: "Credenciales inválidas",
      });
    }

    const passwordCorrecta = await user.comparePassword(password);

    if (!passwordCorrecta) {
      return res.status(401).json({
        estado: "error",
        mensaje: "Credenciales inválidas",
      });
    }

    return res.json({
      estado: "ok",
      mensaje: "Inicio de sesión exitoso",
      usuario: {
        id: user._id,
        name: user.name,
        email: user.email,
        rol: user.rol,
      },
      token: generarToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------
// 🟣 PERFIL DEL USUARIO LOGUEADO
// -------------------------------------------
export const getProfile = async (req, res, next) => {
  try {
    return res.json({
      estado: "ok",
      usuario: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        rol: req.user.rol,
        creado: req.user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------
// 🔴 LOGOUT SIMPLE
// (Frontend elimina token, no backend)
// -------------------------------------------
export const logoutUser = async (req, res, next) => {
  try {
    return res.json({
      estado: "ok",
      mensaje: "Sesión cerrada correctamente",
    });
  } catch (error) {
    next(error);
  }
};
