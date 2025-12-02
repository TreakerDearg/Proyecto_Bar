import Trago from "../models/Trago.js";
import cloudinary from "../config/cloudinary.js";

// Función helper para subir a Cloudinary con promesa
const subirImagenCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "tragos" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// =========================================================
// 📌 Obtener todos los tragos (público)
// =========================================================
export const getAllTragos = async (req, res, next) => {
  try {
    const tragos = await Trago.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      total: tragos.length,
      data: tragos,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// 📌 Crear un trago (solo admin / superadmin)
// =========================================================
export const createTrago = async (req, res, next) => {
  try {
    const { nombre, descripcion, precio } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({
        success: false,
        message: "Nombre y precio son obligatorios",
      });
    }

    let imagenUrl = null;
    if (req.file) {
      imagenUrl = await subirImagenCloudinary(req.file.buffer);
    }

    const nuevoTrago = await Trago.create({
      nombre,
      descripcion: descripcion || "",
      precio,
      img: imagenUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Trago creado correctamente",
      data: nuevoTrago,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// 📌 Actualizar trago (solo admin / superadmin)
// =========================================================
export const updateTrago = async (req, res, next) => {
  try {
    const { id } = req.params;
    const camposPermitidos = ["nombre", "descripcion", "precio"];
    const dataActualizada = {};

    for (const key of camposPermitidos) {
      if (req.body[key] !== undefined) {
        dataActualizada[key] = req.body[key];
      }
    }

    if (req.file) {
      const imagenUrl = await subirImagenCloudinary(req.file.buffer);
      dataActualizada.img = imagenUrl;
    }

    const tragoActualizado = await Trago.findByIdAndUpdate(id, dataActualizada, { new: true });

    if (!tragoActualizado) {
      return res.status(404).json({
        success: false,
        message: "Trago no encontrado",
      });
    }

    return res.json({
      success: true,
      message: "Trago actualizado correctamente",
      data: tragoActualizado,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// 📌 Eliminar trago (solo superadmin)
// =========================================================
export const deleteTrago = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trago = await Trago.findById(id);

    if (!trago) {
      return res.status(404).json({
        success: false,
        message: "Trago no encontrado",
      });
    }

    await trago.deleteOne();

    return res.json({
      success: true,
      message: "Trago eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};
