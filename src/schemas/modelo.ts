import Modelo from "@/models/modelo";
import mongoose, { Schema, Types, models } from "mongoose";

const modeloSchema = new Schema<Modelo>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models?.Modelo ||
  mongoose.model("Modelo", modeloSchema);
