import mongoose, { ConnectOptions } from "mongoose";
import { ENV } from "./env";

// import "../models/user.model"; // Import all models here
mongoose.Promise = global.Promise; // Use ES6 promises

let isConnected: Boolean = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log("⚠️ Already connected to MongoDB.");
    return;
  }

  try {
    await mongoose.connect(ENV.mongoDbUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    } as ConnectOptions);

    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (err: unknown) {
    if (err instanceof Error) console.error(err.message);
    throw new Error("MongoDB connection failed.");
  }
};

export async function disconnectDB(): Promise<void> {
  if (!isConnected) return;

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("🛑 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error during MongoDB disconnection:", err);
  }
};