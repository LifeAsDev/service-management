import Marca from "@/models/marca";
import mongoose, { Schema, Types, models } from "mongoose";

const marcaSchema = new Schema<Marca>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models?.Marca || mongoose.model("Marca", marcaSchema);
