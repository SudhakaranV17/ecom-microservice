import Fastify from "fastify";
import dotenv from "dotenv";
dotenv.config();
import { clerkPlugin } from "@clerk/fastify";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { ConnectDB } from "@repo/order-db";
import { orderRoute } from "./order.route.js";
import dns from "dns";
import { consumer, producer } from "./utils/kafka.js";
dns.setServers(["1.1.1.1"]);
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
fastify.register(orderRoute);
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
    Promise.all([
      await ConnectDB(),
      await producer.connect(),
      await consumer.connect(),
    ]);
    await fastify.listen({ port: 8001 });
    fastify.log.info(`Server is running on port ${process.env.PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
