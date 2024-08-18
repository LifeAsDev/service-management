import Client from "@/models/client";
import mongoose, { Schema, Types, models } from "mongoose";

const clientSchema = new Schema<Client>(
  {
    fullName: {
      type: String,
      default: "",
    },
    numero: {
      type: String,
      default: "",
    },

    correo: {
      type: String,
      default: "",
    },
    direccion: {
      type: String,
      default: "",
    },
    notas: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models?.Client ||
  mongoose.model("Client", clientSchema);
