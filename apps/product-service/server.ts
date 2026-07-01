import "dotenv/config";
import http from "http";
import app from "./src/app";
import { ConnectDB } from "./src/config/mongo.db";
import logger from "./src/middleware/Logger";

const server = http.createServer(app);
server
  .listen(process.env.PORT || 8000, () => {
    logger.info(`Server is running on port ${process.env.PORT || 8000}`);
    ConnectDB();
  })
  .on("error", (error) => {
    logger.error({ err: error }, "Error starting server");
    process.exit(1);
  });
