import mongoose from "mongoose";
import type { User } from "./userTypes.ts";

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//users
export default mongoose.model<User>("User", userSchema);