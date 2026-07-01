import Fastify from "fastify";
const fastify = Fastify({
    logger: true,
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
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
