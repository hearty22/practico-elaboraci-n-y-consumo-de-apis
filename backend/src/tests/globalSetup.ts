import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// This function will be executed once before all tests.
export default async function () {
  // Start a new in-memory database server.
  const instance = await MongoMemoryServer.create();

  // Get the URI of the in-memory database and set it as an environment variable.
  // The application's database connection logic will use this URI during tests.
  const uri = instance.getUri();
  process.env.TEST_DATABASE_URL = uri;

  console.log(`MongoDB Memory Server started at: ${uri}`);

  // The teardown function that will be called after all tests have run.
  return async () => {
    await mongoose.disconnect(); // Disconnect the mongoose client.
    await instance.stop(); // Stop the in-memory database server.
    console.log("MongoDB Memory Server stopped.");
  };
}
