import Order from "@/models/order";
import mongoose, { Schema, Types, models } from "mongoose";

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
  },
  { timestamps: true }
);

export default mongoose.models?.Order || mongoose.model("Order", orderSchema);
