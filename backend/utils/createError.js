// ======================================================
//  UTILIDAD PARA CREAR ERRORES PERSONALIZADOS
// ======================================================

export const createError = (statusCode, message, codeName = "GENERAL_ERROR") => {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.codeName = codeName;
  error.isCustom = true;

  // Ocultar stacktrace opcionalmente en producción
  if (process.env.NODE_ENV === "production") {
    error.stack = undefined;
  }

  return error;
};
