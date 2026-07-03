import Fastify from "fastify";
import { clerkPlugin, getAuth } from "@clerk/fastify";
import { authMiddleware } from "./middleware/authMiddleware.js";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  },
});
fastify.register(clerkPlugin);
fastify.get("/health", async (request, reply) => {
  return { status: "UP" };
});
fastify.get("/test", { preHandler: authMiddleware }, async (request, reply) => {
  const userId = request.userId;
  return { status: "UP from order service", userId };
});

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: 8001 });
    fastify.log.info(`Server is running on port ${process.env.PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
