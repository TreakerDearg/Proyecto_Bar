import mongoose from "mongoose";

const PedidoSchema = new mongoose.Schema(
  {
    cliente: {
      type: String,
      required: [true, "El nombre del cliente es obligatorio"],
      trim: true,
      minlength: [2, "El nombre del cliente debe tener al menos 2 caracteres"],
      maxlength: [40, "El nombre del cliente no puede superar los 40 caracteres"],
    },

    trago: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trago",
      required: [true, "Debe seleccionar un trago válido"],
    },

    cantidad: {
      type: Number,
      required: true,
      min: [1, "La cantidad mínima es 1"],
      max: [20, "La cantidad máxima es 20"],
    },

    estado: {
      type: String,
      enum: {
        values: ["pendiente", "preparando", "listo", "entregado", "cancelado"],
        message: "Estado no válido",
      },
      default: "pendiente",
    },

    notas: {
      type: String,
      trim: true,
      maxlength: [200, "Las notas no pueden superar los 200 caracteres"],
      default: "",
    },

    // Para reconocer desde qué mesa o QR se pidió
    origen: {
      type: String, // example: mesa-4, barra-1, QR-12345
      trim: true,
      default: "QR",
    },

    // Precio final del pedido (capturado en el momento)
    precioUnitario: {
      type: Number,
      default: null, // Lo calculás del trago en el controller si querés
    },

    precioTotal: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ========================================
// MIDDLEWARE PRE-SAVE
// Normaliza strings y calcula precios
// ========================================
PedidoSchema.pre("save", async function (next) {
  // Normalizar el nombre del cliente
  if (this.cliente) {
    this.cliente = this.cliente.trim();
  }

  // Autocalcular precio solo si no vinieron manualmente
  if (this.isModified("trago") || this.isModified("cantidad")) {
    // Solo calcular si hay trago y cantidad
    try {
      const Trago = mongoose.model("Trago");
      const tragoData = await Trago.findById(this.trago);

      if (tragoData && tragoData.precio) {
        this.precioUnitario = tragoData.precio;
        this.precioTotal = tragoData.precio * this.cantidad;
      }
    } catch (e) {
      // No romper guardado, pero enviar al middleware de errores
      return next(e);
    }
  }

  next();
});

// ========================================
// OPTIMIZACIÓN PARA POPULATE
// ========================================
PedidoSchema.index({ trago: 1 }); // mejora rendimiento en queries con populate
PedidoSchema.index({ estado: 1 }); // listado rápido por estado
PedidoSchema.index({ createdAt: -1 }); // orden más eficiente

export default mongoose.model("Pedido", PedidoSchema);
