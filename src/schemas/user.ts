import User from "@/models/user";
import mongoose, { Schema, Types, models } from "mongoose";

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models?.User || mongoose.model("User", userSchema);
