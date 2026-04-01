import mongoose from "mongoose";

const MONGO_URI: string = process.env.MONGODB_URI || "";

/**
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 */
const mongoConnection = {
  isConnected: 0,
};

export const dbConnect = async () => {
  if (mongoConnection.isConnected) {
    console.log("Using existing database connection.");
    return;
  }

  if (mongoose.connections.length > 0) {
    mongoConnection.isConnected = mongoose.connections[0].readyState;
    if (mongoConnection.isConnected === 1) {
      console.log("Using existing database connection.");
      return;
    }

    await mongoose.disconnect();
  }

  try {
    await mongoose.connect(MONGO_URI);
    mongoConnection.isConnected = 1;
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};
