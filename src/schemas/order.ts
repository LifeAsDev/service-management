import Order from "@/models/order";
import Counter from "@/schemas/counter";
import mongoose, { Schema, Types, models } from "mongoose";

export async function getNextCustomId(): Promise<string> {
  const counter = await Counter.findByIdAndUpdate(
    { _id: "orderCustomId" }, // ID único del contador para órdenes
    { $inc: { sequence_value: 1 } }, // Incrementa el valor
    { new: true, upsert: true } // Si no existe, crea el contador
  );

  const sequence = counter.sequence_value.toString().padStart(7, "0"); // Rellenar con ceros
  return `st-${sequence}`; // Devolver el customId con el formato
}

const orderSchema = new Schema<Order>(
  {
    marca: {
      type: String,
    },
    modelo: {
      type: String,
    },
    tipo: {
      type: String,
    },
    cliente: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    numeroDeSerie: {
      type: String,
    },
    contraseña: {
      type: String,
    },
    estado: {
      type: String,
      enum: [
        "Asignada",
        "Revisión",
        "Reparada",
        "Rechazada",
        "Sin Solución",
        "Entregado",
      ],
      default: "Asignada",
    },
    costos: [
      {
        nombre: String,
        costo: String,
      },
    ],
    clienteFullName: {
      type: String,
    },
    customId: {
      type: String,
      unique: true, // Asegurar que sea único
    },
    observacion: {
      type: String,
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  if (!this.customId) {
    // Si no hay customId, lo generamos
    this.customId = await getNextCustomId();
  }
  next();
});

export default mongoose.models?.Order || mongoose.model("Order", orderSchema);
