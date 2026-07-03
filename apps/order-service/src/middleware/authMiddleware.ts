import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }
}

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { userId } = await getAuth(request);
  if (!userId) {
    return reply
      .status(401)
      .send({ message: "Unauthorized from order service" });
  }
  request.userId = userId;
};
