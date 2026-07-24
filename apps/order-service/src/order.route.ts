import { FastifyInstance } from "fastify";
import { authMiddleware } from "./middleware/authMiddleware";
import { Order } from "@repo/order-db";

export const orderRoute = async (fastify: FastifyInstance) => {
  fastify.get(
    "/user-order",
    { preHandler: authMiddleware },
    async (request, reply) => {
      const userId = request.userId;
      const orders = await Order.find({ userId });
      return reply.send(orders);
    },
  );
  fastify.get("/orders", async (request, reply) => {
    const orders = await Order.find({});
    return reply.send(orders);
  });
};
