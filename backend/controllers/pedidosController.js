// ========================================
//  IMPORTS
// ========================================
import Pedido from "../models/Pedido.js";
import mongoose from "mongoose";


// ========================================
//  OBTENER TODOS LOS PEDIDOS
// ========================================
export const getAllPedidos = async (req, res, next) => {
  try {
    const pedidos = await Pedido.find()
      .populate({
        path: "trago",
        select: "nombre precio categoria", // optimizamos datos
      })
      .sort({ createdAt: -1 }); // último pedido primero

    res.status(200).json({
      success: true,
      total: pedidos.length,
      data: pedidos,
    });

  } catch (err) {
    next(err);
  }
};


// ========================================
//  CREAR PEDIDO
// ========================================
export const createPedido = async (req, res, next) => {
  try {
    const { cliente, trago, cantidad, notas } = req.body;

    // Validación básica antes de crear
    if (!cliente || !trago || !cantidad) {
      const error = new Error("Faltan datos obligatorios para crear el pedido.");
      error.statusCode = 400;
      return next(error);
    }

    // Validar ObjectId del trago
    if (!mongoose.Types.ObjectId.isValid(trago)) {
      const error = new Error("El ID del trago no es válido.");
      error.statusCode = 400;
      error.codeName = "INVALID_TRAGO_ID";
      return next(error);
    }

    const nuevoPedido = await Pedido.create({
      cliente,
      trago,
      cantidad,
      notas: notas || "",
    });

    res.status(201).json({
      success: true,
      message: "Pedido creado exitosamente",
      data: nuevoPedido,
    });

  } catch (err) {
    next(err);
  }
};


// ========================================
//  ACTUALIZAR PEDIDO
// ========================================
export const updatePedido = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("El ID del pedido no es válido.");
      error.statusCode = 400;
      error.codeName = "INVALID_PEDIDO_ID";
      return next(error);
    }

    const allowedUpdates = ["estado", "cantidad", "notas"];
    const updates = Object.keys(req.body);

    // Evitar actualizar campos no permitidos
    const isValidUpdate = updates.every(field =>
      allowedUpdates.includes(field)
    );

    if (!isValidUpdate) {
      const error = new Error("Intentas actualizar campos no permitidos.");
      error.statusCode = 400;
      error.codeName = "INVALID_UPDATE_FIELDS";
      return next(error);
    }

    const pedidoActualizado = await Pedido.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!pedidoActualizado) {
      const error = new Error("Pedido no encontrado.");
      error.statusCode = 404;
      error.codeName = "PEDIDO_NOT_FOUND";
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Pedido actualizado correctamente",
      data: pedidoActualizado,
    });

  } catch (err) {
    next(err);
  }
};
