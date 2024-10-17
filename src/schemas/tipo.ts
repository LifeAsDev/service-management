import Tipo from "@/models/tipo";
import mongoose, { Schema, Types, models } from "mongoose";

const tipoSchema = new Schema<Tipo>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models?.Tipo || mongoose.model("Tipo", tipoSchema);
