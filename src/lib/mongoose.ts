import mongoose, { Mongoose } from "mongoose";

import logger from "./logger";

import "@/database";

// Setup mongoose connection event listeners for better debugging
mongoose.connection.on("connected", () => {
  logger.info("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  logger.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  logger.info("Mongoose disconnected from MongoDB");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  logger.info("Mongoose connection closed through app termination");
  process.exit(0);
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async (): Promise<Mongoose> => {
  if (cached.conn) {
    logger.info("Using cached connection to Mongoose");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "devflow",
        // Connection timeout settings
        serverSelectionTimeoutMS: 30000, // 30 seconds to select server
        connectTimeoutMS: 30000, // 30 seconds to establish connection
        socketTimeoutMS: 30000, // 30 seconds for socket activity

        // Buffer settings to prevent timeout errors
        bufferCommands: false, // Disable mongoose buffering

        // Connection pool settings for better performance
        maxPoolSize: 10, // Maximum number of connections
        minPoolSize: 2, // Minimum number of connections
        maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity

        // Retry settings
        retryWrites: true,
        retryReads: true,

        // Additional stability settings
        heartbeatFrequencyMS: 10000, // Check connection every 10 seconds
      })
      .then((result) => {
        logger.info("Connected to MongoDB");
        return result;
      })
      .catch((err) => {
        logger.error("Error connecting to MongoDB", err);
        // Reset cached promise so next attempt can retry
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default dbConnect;
