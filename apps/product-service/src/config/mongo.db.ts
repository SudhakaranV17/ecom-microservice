import mongoose from "mongoose";
import logger from "../middleware/Logger";

export async function ConnectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    logger.info(
      { db: mongoose.connection.db?.databaseName },
      "Database connected",
    );
  } catch (error) {
    logger.error({ error: error }, "Error connecting to database");
  }
}
