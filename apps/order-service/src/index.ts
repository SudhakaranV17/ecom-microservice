import Fastify from "fastify";

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

fastify.get("/health", async (request, reply) => {
  return { status: "UP" };
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
