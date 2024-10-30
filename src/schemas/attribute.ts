import Attribute, { InputTypeOptions } from "@/models/attribute";
import Counter from "@/schemas/counter";
import mongoose, { Schema, Types, models } from "mongoose";

const attributeSchema = new Schema<Attribute>(
  {
    name: {
      type: String,
      required: true,
    },
    inputType: {
      type: String,
      enum: Object.values(InputTypeOptions),
      required: true,
    },
  },
  { timestamps: true }
);

attributeSchema.index({ name: 1, inputType: 1 }, { unique: true });

export default mongoose.models?.Attribute ||
  mongoose.model("Attribute", attributeSchema);
