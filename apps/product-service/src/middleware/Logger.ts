import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "dd-mm-yyyy HH:MM:ss",
      },
    },
  }),
});

export default logger;
