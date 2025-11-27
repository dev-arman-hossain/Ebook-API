import mongoose from "mongoose";
import { config } from "./config.ts";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Database connection failed", err);
    });

    await mongoose.connect(config.databaseUrl as string);
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
