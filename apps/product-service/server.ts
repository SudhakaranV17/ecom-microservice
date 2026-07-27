import "dotenv/config";
import http from "http";
import app from "./src/app";
import logger from "./src/middleware/Logger";
import { consumer, producer } from "./src/utils/kafka";

const server = http.createServer(app);

const start = async () => {
  try {
    Promise.all([await producer.connect(), await consumer.connect()]);
    server.listen(process.env.PORT || 8000, () => {
      logger.info(`Server is running on port ${process.env.PORT || 8000}`);
    });
  } catch (error) {
    logger.error({ err: error }, "Error starting server");
    process.exit(1);
  }
};

start();
