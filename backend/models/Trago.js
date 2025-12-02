import mongoose from "mongoose";

const TragoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del trago es obligatorio"],
      unique: true,
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [40, "El nombre no puede superar los 40 caracteres"],
    },

    descripcion: {
      type: String,
      trim: true,
      maxlength: [300, "La descripción no puede superar los 300 caracteres"],
      default: "",
    },

    ingredientes: {
      type: [String],
      validate: {
        validator: (arr) => arr.every((i) => typeof i === "string"),
        message: "Todos los ingredientes deben ser texto",
      },
      default: [],
    },

    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [100, "El precio mínimo es 100"],
      max: [50000, "El precio es demasiado alto"],
    },

    tematica: {
      type: String,
      enum: {
        values: ["Neon", "Vaporwave", "Retro", "Clásico", "Premium"],
        message: "Temática inválida",
      },
      default: "Neon",
    },

    imagen: {
      type: String,
      default: "",
      validate: {
        validator: (v) =>
          v === "" || v.startsWith("http") || v.startsWith("data:image/"),
        message: "La imagen debe ser una URL válida o base64",
      },
    },

    enServicio: {
      type: Boolean,
      default: true,
    },

    stock: {
      type: Number,
      min: [0, "El stock no puede ser negativo"],
      default: 50,
    },

    tiempoPreparacion: {
      type: Number,
      min: [1, "Debe ser al menos 1 minuto"],
      max: [60, "No puede superar 60 minutos"],
      default: 5,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ========================================
// LIMPIEZA AUTOMÁTICA ANTES DE GUARDAR
// ========================================
TragoSchema.pre("save", function (next) {
  if (this.nombre) this.nombre = this.nombre.trim();
  if (this.descripcion) this.descripcion = this.descripcion.trim();

  if (this.ingredientes && Array.isArray(this.ingredientes)) {
    this.ingredientes = this.ingredientes.map((i) => i.trim());
  }

  next();
});

// ========================================
// ÍNDICES PARA RENDIMIENTO
// ========================================
TragoSchema.index({ tematica: 1 });
TragoSchema.index({ enServicio: 1 });
TragoSchema.index({ precio: 1 });

export default mongoose.model("Trago", TragoSchema);
