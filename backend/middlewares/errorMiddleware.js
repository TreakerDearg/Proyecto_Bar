// ========================================
//  IMPORTS RELEVANTES
// ========================================
import mongoose from "mongoose";
import jwt from "jsonwebtoken";


// ========================================
//  404 — Rutas no encontradas
// ========================================
export const notFound = (req, res, next) => {
  const error = new Error(`❌ Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  error.codeName = "ROUTE_NOT_FOUND";
  next(error);
};


// ========================================
//  Middleware Global de Errores
// ========================================
export const errorHandler = (err, req, res, next) => {

  // ========================================
  // DETECCIÓN DE ERRORES PERSONALIZADOS
  // (createError.js le añade isCustom = true)
  // ========================================
  const isCustom = err.isCustom === true;


  // ========================================
  // LOG PROFESIONAL (SOLO DEBUG / DEV)
  // ========================================
  if (process.env.NODE_ENV !== "production") {
    console.error("========================================");
    console.error("🔴 ERROR GLOBAL DETECTADO");
    console.error("➡️ Custom:", isCustom);
    console.error("➡️ Código:", err.statusCode || 500);
    console.error("➡️ Tipo:", err.codeName || err.name || "ErrorGeneral");
    console.error("➡️ Método:", req.method);
    console.error("➡️ Ruta:", req.originalUrl);
    console.error("➡️ Fecha:", new Date().toISOString());
    console.error("➡️ Mensaje:", err.message);
    console.error("➡️ Stack:", err.stack);
    console.error("========================================");
  }

  // ========================================
  //  VARIABLES BASE
  // ========================================
  let statusCode = err.statusCode || 500;
  let message = err.message || "Error interno del servidor";
  let codeName = err.codeName || "SERVER_ERROR";


  // ========================================
  // 🔥 ERRORES PERSONALIZADOS (del utils)
  // ========================================
  if (isCustom) {
    // El error fue creado con createError
    return res.status(statusCode).json({
      success: false,
      status: statusCode,
      error: codeName,
      message,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack
    });
  }


  // ========================================
  // 🔥 ERRORES ESPECÍFICOS Y DETALLADOS
  // ========================================

  // 1. Mongoose — ID inválido
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    codeName = "INVALID_ID";
    message = `El ID proporcionado no es válido: ${err.value}`;
  }

  // 2. Mongoose — Validación
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    codeName = "VALIDATION_ERROR";
    message = Object.values(err.errors).map(e => e.message).join(". ");
  }

  // 3. Duplicados (Mongo)
  if (err.code === 11000) {
    statusCode = 409;
    codeName = "DUPLICATE_KEY";
    const campo = Object.keys(err.keyValue)[0];
    message = `El valor del campo '${campo}' ya está registrado.`;
  }

  // 4. JWT — Token inválido
  if (err instanceof jwt.JsonWebTokenError) {
    statusCode = 401;
    codeName = "TOKEN_INVALID";
    message = "Token inválido. Acceso no autorizado.";
  }

  // 5. JWT — Token expirado
  if (err instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    codeName = "TOKEN_EXPIRED";
    message = "El token ha expirado. Por favor inicia sesión nuevamente.";
  }

  // 6. JSON mal formado
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    codeName = "INVALID_JSON";
    message = "El cuerpo de la petición no contiene JSON válido.";
  }

  // 7. Métodos no permitidos
  if (err.code === "METHOD_NOT_ALLOWED") {
    statusCode = 405;
    codeName = "METHOD_NOT_ALLOWED";
    message = `El método ${req.method} no está permitido en esta ruta.`;
  }


  // ========================================
  // SANITIZACIÓN PARA PRODUCCIÓN
  // ========================================
  if (process.env.NODE_ENV === "production") {
    if (statusCode === 500) {
      message = "Ocurrió un error inesperado. Inténtalo más tarde.";
    }
  }


  // ========================================
  // RESPUESTA FINAL (FORMATO ESTÁNDAR)
  // ========================================
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    error: codeName,
    message,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
