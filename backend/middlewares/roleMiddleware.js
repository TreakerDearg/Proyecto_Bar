// middlewares/roleMiddleware.js

export const requireRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        estado: "error",
        mensaje: "No autorizado: usuario no autenticado",
      });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        estado: "error",
        mensaje: `Acceso denegado: requiere uno de estos roles → ${rolesPermitidos.join(
          ", "
        )}`,
      });
    }

    next();
  };
};
