import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(uri, {
      dbName: "debate_platform",
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });

    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // Rethrow to allow API routes to handle the error
  }
};
