import Attribute, { InputTypeOptions } from "@/models/attribute";
import Counter from "@/schemas/counter";
import mongoose, { Schema, Types, models } from "mongoose";

const attributeSchema = new Schema<Attribute>(
  {
    name: {
      type: String,
    },
    inputType: {
      type: String,
      enum: Object.values(InputTypeOptions),
    },
  },
  { timestamps: true }
);

export default mongoose.models?.Attribute ||
  mongoose.model("Attribute", attributeSchema);
