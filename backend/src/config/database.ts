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
    return;
  }

  if (mongoose.connections.length > 0) {
    mongoConnection.isConnected = mongoose.connections[0].readyState;
    if (mongoConnection.isConnected === 1) {
      return;
    }

    await mongoose.disconnect();
  }

  const connectionString = process.env.TEST_DATABASE_URL || MONGO_URI;

  try {
    await mongoose.connect(connectionString);
    mongoConnection.isConnected = 1;

    // Forma segura de loguear la conexión sin exponer credenciales
    const safeLogUri = connectionString.includes("@")
      ? connectionString.split("@")[1]
      : connectionString;
    console.log(`Database connected to: ${safeLogUri}`);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};
