import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";
import type { CustomJwtSessionClaims } from "@repo/types";

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
    return reply.status(401).send({ message: "you are not logged in" });
  }
  request.userId = userId;
};

export const accessControlMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const auth = await getAuth(request);
  if (!auth.userId) {
    return reply.status(401).send({ message: "you are not logged in" });
  }
  const claims = auth.sessionClaims as CustomJwtSessionClaims;
  if (claims.metadata?.role !== "admin") {
    return reply.status(403).send({ message: "You are not authorized" });
  }
  request.userId = auth.userId;
};
