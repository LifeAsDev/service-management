import mongoose, { Schema } from "mongoose";

// Esquema para el contador atómico
const counterSchema = new Schema({
  _id: { type: String, required: true }, // Nombre del contador
  sequence_value: { type: Number, default: 0 }, // Valor del contador
});

const Counter =
  mongoose.models.Counter || mongoose.model("Counter", counterSchema);

export default Counter;
